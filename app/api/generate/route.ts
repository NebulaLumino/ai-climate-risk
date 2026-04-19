import OpenAI from 'openai';

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(request: Request) {
  try {
    const { inputs } = await request.json();

    const prompt = `You are a world-class climate risk analyst and environmental scientist. Based on the following inputs, generate a comprehensive climate risk assessment report.

INPUTS:
${inputs}

Please provide your response in this exact format:

## 🏔️ Climate Risk Assessment Report

### Risk Profile Summary
[Overall climate risk level and key threats]

### 🌡️ Temperature & Heat Risks
[Specific temperature-related risks based on location]

### 🌊 Flood & Sea Level Risks
[Flooding, sea level rise, and coastal erosion risks]

### 🌪️ Extreme Weather Events
[Storms, droughts, wildfires, and other extreme events]

### 🏭 Physical Risk Factors
[Infrastructure, supply chain, and business continuity risks]

### 📋 Risk Mitigation Roadmap

#### Short-Term (0-2 years)
[Immediate risk reduction actions]

#### Medium-Term (2-5 years)
[Systemic changes and adaptations]

#### Long-Term (5-10 years)
[Transformational resilience strategies]

### 📊 Risk Scoring
[Provide a 1-10 risk score for each category with justification]

### ✅ Recommended Next Steps
[Top 5 priority actions with estimated cost/benefit]

Be specific with data, risk percentages, and actionable recommendations.`;

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class climate risk analyst and environmental scientist specializing in climate resilience and risk assessment.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';
    return Response.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
