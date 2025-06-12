import { ChatAnthropic } from '@langchain/anthropic';
import { BaseProvider } from './BaseProvider.js';

export class AnthropicProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.client = null;
  }

  async initialize() {
    const apiKey = this.config.getApiKey();
    if (!apiKey) {
      throw new Error('Anthropic API key not found. Set ANTHROPIC_API_KEY environment variable.');
    }

    this.client = new ChatAnthropic({
      anthropicApiKey: apiKey,
      modelName: this.config.getModel(),
      temperature: this.config.getConfig().temperature,
      maxTokens: this.config.getConfig().maxTokens,
      timeout: this.config.getConfig().timeout
    });
  }

  async generateResponse(userInput, context = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const systemPrompt = this.formatSystemPrompt(context);
    const userPrompt = this.formatUserPrompt(userInput, context);

    try {
      const response = await this.client.invoke([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return this.parseResponse(response.content);
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Anthropic API call failed: ${error.message}`);
    }
  }

  async generateStructuredResponse(userInput, schema, context = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const systemPrompt = this.formatSystemPrompt(context) + `

Please respond in JSON format matching this schema:
${JSON.stringify(schema, null, 2)}

Ensure your response is valid JSON that can be parsed.`;

    const userPrompt = this.formatUserPrompt(userInput, context);

    try {
      const response = await this.client.invoke([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return this.parseStructuredResponse(response.content, schema);
    } catch (error) {
      console.error('Anthropic Structured API Error:', error);
      throw new Error(`Anthropic structured API call failed: ${error.message}`);
    }
  }

  validateConfig() {
    const config = this.config.getConfig();
    if (!config.provider || !config.model) {
      return { valid: false, error: 'Provider and model must be specified' };
    }

    const apiKey = this.config.getApiKey();
    if (!apiKey) {
      return { valid: false, error: 'Anthropic API key not found' };
    }

    return { valid: true };
  }

  parseResponse(content) {
    // Parse Anthropic response and extract code if present
    const codeRegex = /```(?:javascript|js|strudel)?\n?([\s\S]*?)```/;
    const match = content.match(codeRegex);
    
    const text = content.replace(codeRegex, '').trim();
    const code = match ? match[1].trim() : null;
    
    return {
      text: text || 'Generated a pattern for you!',
      code: code,
      explanation: code ? 'This creates a Strudel pattern as requested.' : null
    };
  }

  parseStructuredResponse(content, schema) {
    try {
      // Try to extract JSON from the response
      const jsonRegex = /```json\n?([\s\S]*?)```/;
      const match = content.match(jsonRegex);
      
      let jsonStr = match ? match[1] : content;
      
      // Clean up common JSON formatting issues
      jsonStr = jsonStr.trim();
      if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) {
        // Try to find JSON within the content
        const jsonMatch = jsonStr.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
      }
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('Failed to parse structured response as JSON:', error);
      // Fallback to regular response parsing
      return this.parseResponse(content);
    }
  }
}