import { OutputMode, getSystemPrompt } from './prompts';

export interface OcrResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export const processDocumentWithOpenRouter = async (
  apiKey: string,
  modelName: string,
  fileDataUris: string[],
  outputMode: OutputMode,
  additionalPrompt?: string
): Promise<OcrResult> => {
  let systemPrompt = getSystemPrompt(outputMode);

  if (additionalPrompt && additionalPrompt.trim()) {
    systemPrompt += `\n\n[YÊU CẦU ĐẶC BIỆT / BỔ SUNG TỪ NGƯỜI DÙNG]:\n${additionalPrompt.trim()}`;
  }

  const contentArray: any[] = [
    { type: 'text', text: 'Hãy tiến hành OCR tài liệu/ảnh sau đây theo đúng yêu cầu.' }
  ];

  fileDataUris.forEach(uri => {
    contentArray.push({
      type: 'image_url',
      image_url: { url: uri }
    });
  });

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost',
      'X-Title': 'Looking-Back-OCR-Nextjs',
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.1,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: contentArray
        }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API Error (${res.status}): ${errText}`);
  }

  const resData = await res.json();
  let textOutput = resData?.choices?.[0]?.message?.content || '';

  if (textOutput.includes('\`\`\`')) {
    const match = textOutput.match(/\`\`\`(?:html|markdown|xml)?([\s\S]*?)\`\`\`/i);
    if (match && match[1]) {
      textOutput = match[1].trim();
    }
  }

  const usage = resData?.usage || {};
  return {
    content: textOutput,
    inputTokens: usage.prompt_tokens || 0,
    outputTokens: usage.completion_tokens || 0
  };
};
