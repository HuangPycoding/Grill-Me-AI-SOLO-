export interface AssessmentData {
  radarData: { subject: string; student: number; requirement: number; fullMark: number }[];
  truthItems: { emoji: string; title: string; content: string }[];
  summary: string;
  matchScore: number;
  firstGrillQuestion: string;
}

// 帮助函数：调用通用的 OpenAI 兼容 API 接口 (支持阿里云百炼、DeepSeek、硅基流动等)
async function callOpenAICompatibleAPI(apiKey: string, baseUrl: string, modelName: string, messages: { role: string, content: string }[]) {
  if (!apiKey || !baseUrl || !modelName) {
    throw new Error("API 缺少必填配置项 (Key, Base URL 或 模型名称)。请在首页补充。");
  }

  // 确尾部没有多余的斜杠，并补全标准 chat 路由
  const endpoint = baseUrl.replace(/\/$/, '') + '/chat/completions';

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      response_format: { type: "json_object" }, // 强制 JSON 模式（大部分兼容模型支持）
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`模型调用失败: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  
  // 清理可能存在的 markdown 代码块包裹 (针对某些模型强制输出 markdown 标记的修正)
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(content);
}

export async function analyzeResume(role: string, resume: string, apiKey: string, baseUrl: string, modelName: string): Promise<AssessmentData> {
  const prompt = `You are an extremely strict, toxic, and highly experienced technical recruiter and tech lead. 
The candidate is applying for: ${role}
Their resume/description:
${resume}

Analyze this realistically but brutally. 
1. Provide radar chart data for 6 dimensions relevant to the role (e.g. '底层原理', '工程能力', '业务理解'). Evaluate strictly. 'student' is their score (0-100), 'requirement' is the role's baseline requirement (0-100), fullMark must be 100.
2. Provide 2-3 "Brutal Truth (毒舌短评)" items. Point out empty buzzwords, missing fundamentals, or logical leaps. Keep it sharp and in Chinese.
3. A short brutal summary (1-2 sentences in Chinese).
4. A comprehensive match score (0-100).
5. The very first hostile interview question you will ask them in the chat based on their weakest point.

Return purely a JSON object matching this EXACT schema:
{
  "radarData": [
    { "subject": "string", "student": 0, "requirement": 0, "fullMark": 100 }
  ],
  "truthItems": [
    { "emoji": "string", "title": "string", "content": "string" }
  ],
  "summary": "string",
  "matchScore": 0,
  "firstGrillQuestion": "string"
}`;

  return callOpenAICompatibleAPI(apiKey, baseUrl, modelName, [{ role: "user", content: prompt }]) as Promise<AssessmentData>;
}

export interface GrillTurnResponse {
  interviewerResponse: string;
  feedback: {
    score: number;
    logic: string;
    suggestion: string;
  };
}

export async function generateNextGrill(
  role: string,
  resume: string,
  chatHistory: { role: 'ai' | 'user', content: string }[],
  lastUserMessage: string,
  apiKey: string,
  baseUrl: string,
  modelName: string
): Promise<GrillTurnResponse> {
  const prompt = `You are an extremely strict, hostile technical interviewer interviewing a candidate for "${role}".
Candidate's resume context: ${resume}

The user just answered your previous question with:
"${lastUserMessage}"

TASK:
1. Evaluate their answer strictly out of 100. Be brutal if they use empty buzzwords, lack detail, or have logical gaps.
2. Provide feedback logic (why they sucked or what they missed) in Chinese.
3. Provide a high-EQ / highly logical example answer (suggestion) in Chinese.
4. Generate YOUR NEXT response as the interviewer (interviewerResponse). Keep up the pressure, probe deeper, or call out their BS. Keep it conversational but aggressive.

Return purely a JSON object matching this EXACT schema:
{
  "interviewerResponse": "string",
  "feedback": {
    "score": 0,
    "logic": "string",
    "suggestion": "string"
  }
}`;

  const apiMessages = chatHistory.map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content
  }));

  apiMessages.push({ role: "user", content: prompt });

  return callOpenAICompatibleAPI(apiKey, baseUrl, modelName, apiMessages) as Promise<GrillTurnResponse>;
}
