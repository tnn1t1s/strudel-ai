// Base AI Provider Interface
export class BaseProvider {
  constructor(config) {
    this.config = config;
  }

  async initialize() {
    throw new Error('initialize() must be implemented by provider');
  }

  async generateResponse(prompt, context = {}) {
    throw new Error('generateResponse() must be implemented by provider');
  }

  async generateStructuredResponse(prompt, schema, context = {}) {
    throw new Error('generateStructuredResponse() must be implemented by provider');
  }

  validateConfig() {
    throw new Error('validateConfig() must be implemented by provider');
  }

  getModelInfo() {
    return this.config.getModelInfo();
  }

  formatSystemPrompt(context) {
    return `You are an AI assistant specialized in Strudel live coding for electronic music.

Context: ${JSON.stringify(context, null, 2)}

Current patterns in the editor:
${context.currentPatterns || 'No patterns currently active'}

Your role:
- Generate Strudel pattern code for musical requests
- Understand musical relationships and harmony
- Create contextually appropriate patterns that complement existing music
- Use proper Strudel syntax and musical theory

Guidelines:
- Always respond with valid Strudel code
- Consider the musical context (key, tempo, style)
- Generate patterns that work well with existing content
- Be creative but musically coherent
- Use appropriate sound sources and effects`;
  }

  formatUserPrompt(userInput, context) {
    return `User request: "${userInput}"

Please generate appropriate Strudel code for this request. Consider the current musical context and create patterns that complement the existing music.

Respond with:
1. A brief explanation of what you're creating
2. The Strudel code
3. Optional: suggestions for variations or next steps`;
  }
}