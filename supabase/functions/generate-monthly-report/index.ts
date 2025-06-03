
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the current month or specific month from request
    const { month } = await req.json().catch(() => ({}))
    const reportDate = month ? new Date(month) : new Date()
    const reportMonth = `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}-01`

    // Fetch sales data for the month
    const { data: salesData, error: salesError } = await supabaseClient
      .from('sales_transactions')
      .select(`
        *,
        inventory_items(name, category),
        profiles!vendor_id(name)
      `)
      .eq('business_id', user.id)
      .gte('sale_date', reportMonth)
      .lt('sale_date', new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 1).toISOString())

    if (salesError) {
      console.error('Sales data error:', salesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sales data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate totals
    const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0
    const totalProfit = salesData?.reduce((sum, sale) => sum + Number(sale.profit_amount), 0) || 0
    const totalVendorCommission = salesData?.reduce((sum, sale) => sum + Number(sale.vendor_commission || 0), 0) || 0
    const netProfit = totalProfit - totalVendorCommission

    // Prepare data for OpenAI analysis
    const salesSummary = {
      totalSales,
      totalProfit,
      totalVendorCommission,
      netProfit,
      totalTransactions: salesData?.length || 0,
      topCategories: {},
      vendorPerformance: {},
      dailyTrends: {}
    }

    // Group by categories
    if (salesData) {
      salesData.forEach(sale => {
        const category = sale.inventory_items?.category || 'Unknown'
        if (!salesSummary.topCategories[category]) {
          salesSummary.topCategories[category] = { sales: 0, profit: 0, quantity: 0 }
        }
        salesSummary.topCategories[category].sales += Number(sale.total_amount)
        salesSummary.topCategories[category].profit += Number(sale.profit_amount)
        salesSummary.topCategories[category].quantity += sale.quantity
      })

      // Group by vendors
      salesData.forEach(sale => {
        const vendorName = sale.profiles?.name || 'Owner'
        if (!salesSummary.vendorPerformance[vendorName]) {
          salesSummary.vendorPerformance[vendorName] = { sales: 0, commission: 0, transactions: 0 }
        }
        salesSummary.vendorPerformance[vendorName].sales += Number(sale.total_amount)
        salesSummary.vendorPerformance[vendorName].commission += Number(sale.vendor_commission || 0)
        salesSummary.vendorPerformance[vendorName].transactions += 1
      })
    }

    // Generate AI insights using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `
    Analyze this monthly business report and provide actionable insights:

    Business Performance Summary for ${new Date(reportMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}:
    - Total Sales: $${totalSales.toFixed(2)}
    - Total Profit: $${totalProfit.toFixed(2)}
    - Vendor Commissions: $${totalVendorCommission.toFixed(2)}
    - Net Profit: $${netProfit.toFixed(2)}
    - Total Transactions: ${salesSummary.totalTransactions}

    Top Categories: ${JSON.stringify(salesSummary.topCategories, null, 2)}
    Vendor Performance: ${JSON.stringify(salesSummary.vendorPerformance, null, 2)}

    Please provide:
    1. Key performance insights
    2. Areas for improvement
    3. Vendor performance analysis
    4. Recommendations for next month
    5. Financial health assessment

    Keep the response professional, actionable, and under 500 words.
    `

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst providing insights for an inventory management system. Focus on actionable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI insights' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiResult = await openaiResponse.json()
    const aiInsights = aiResult.choices[0]?.message?.content || 'No insights generated'

    // Save or update the monthly report
    const { data: existingReport } = await supabaseClient
      .from('monthly_reports')
      .select('id')
      .eq('business_id', user.id)
      .eq('report_month', reportMonth)
      .single()

    const reportData = {
      business_id: user.id,
      report_month: reportMonth,
      total_sales: totalSales,
      total_profit: totalProfit,
      total_vendor_commission: totalVendorCommission,
      net_profit: netProfit,
      ai_insights: aiInsights,
    }

    let reportResult
    if (existingReport) {
      // Update existing report
      reportResult = await supabaseClient
        .from('monthly_reports')
        .update(reportData)
        .eq('id', existingReport.id)
        .select()
        .single()
    } else {
      // Create new report
      reportResult = await supabaseClient
        .from('monthly_reports')
        .insert([reportData])
        .select()
        .single()
    }

    if (reportResult.error) {
      console.error('Report save error:', reportResult.error)
      return new Response(
        JSON.stringify({ error: 'Failed to save report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        report: reportResult.data,
        summary: salesSummary
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
