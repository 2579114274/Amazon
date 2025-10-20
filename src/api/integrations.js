import { base44 } from './base44Client';

export const Core = base44.integrations.Core;

export const InvokeLLM = base44.integrations.Core.InvokeLLM;

export const SendEmail = base44.integrations.Core.SendEmail;

// Local Gemini client (REST) - 修改为使用后端代理
import { LocalGeminiSettings } from './localEntities';

export async function GeminiGenerate({ prompt, model = 'gemini-1.5-flash', temperature = 0.7 }) {
  try {
    // 使用后端代理而不是直接调用Gemini API
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: String(prompt || ''),
        model: model,
        temperature: temperature
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    return { text, raw: json };
  } catch (error) {
    console.error('Gemini API error:', error);
    // 保持原有的错误处理逻辑
    const msg = error?.message || 'Failed to fetch';
    throw new Error(msg.includes('Failed to fetch') ? '网络请求失败（可能是网络或浏览器拦截）。请检查 API Key、网络、广告拦截插件，并重试。' : msg);
  }
}






