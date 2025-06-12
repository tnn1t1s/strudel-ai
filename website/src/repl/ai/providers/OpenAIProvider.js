import { ChatOpenAI } from '@langchain/openai';
import { BaseProvider } from './BaseProvider.js';

export class OpenAIProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.client = null;
  }

  async initialize() {
    const apiKey = this.config.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Set OPENAI_API_KEY environment variable.');
    }

    this.client = new ChatOpenAI({
      openAIApiKey: apiKey,
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
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
  }

  async generateStructuredResponse(userInput, schema, context = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const systemPrompt = this.formatSystemPrompt(context) + `

Please respond in JSON format matching this schema:
${JSON.stringify(schema, null, 2)}`;

    const userPrompt = this.formatUserPrompt(userInput, context);

    try {
      const response = await this.client.invoke([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return this.parseStructuredResponse(response.content, schema);
    } catch (error) {
      console.error('OpenAI Structured API Error:', error);
      throw new Error(`OpenAI structured API call failed: ${error.message}`);
    }
  }

  validateConfig() {
    const config = this.config.getConfig();
    if (!config.provider || !config.model) {
      return { valid: false, error: 'Provider and model must be specified' };
    }

    const apiKey = this.config.getApiKey();
    if (!apiKey) {
      return { valid: false, error: 'OpenAI API key not found' };
    }

    return { valid: true };
  }

  parseResponse(content) {
    // Parse OpenAI response and extract code if present
    const codeRegex = /```(?:javascript|js)?\n?([\s\S]*?)```/;
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
      
      // Try to parse as JSON
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('Failed to parse structured response as JSON:', error);
      // Fallback to regular response parsing
      return this.parseResponse(content);
    }
  }
}