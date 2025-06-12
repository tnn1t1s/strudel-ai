import { AIConfig, AI_PROVIDERS } from './config.js';
import { OpenAIProvider } from './providers/OpenAIProvider.js';
import { AnthropicProvider } from './providers/AnthropicProvider.js';

export class LangGraphAI {
  constructor(config = {}) {
    this.config = new AIConfig(config);
    this.provider = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const providerType = this.config.getProvider();
    
    switch (providerType) {
      case AI_PROVIDERS.OPENAI:
        this.provider = new OpenAIProvider(this.config);
        break;
      case AI_PROVIDERS.ANTHROPIC:
        this.provider = new AnthropicProvider(this.config);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${providerType}`);
    }

    await this.provider.initialize();
    this.initialized = true;
  }

  async generateResponse(userInput, context = {}) {
    await this.initialize();
    
    const validation = this.provider.validateConfig();
    if (!validation.valid) {
      throw new Error(`Configuration error: ${validation.error}`);
    }

    return await this.provider.generateResponse(userInput, context);
  }

  async generateStructuredResponse(userInput, schema, context = {}) {
    await this.initialize();
    
    const validation = this.provider.validateConfig();
    if (!validation.valid) {
      throw new Error(`Configuration error: ${validation.error}`);
    }

    return await this.provider.generateStructuredResponse(userInput, schema, context);
  }

  getModelInfo() {
    return this.config.getModelInfo();
  }

  updateConfig(updates) {
    this.config.updateConfig(updates);
    this.initialized = false; // Force re-initialization with new config
  }

  getCurrentProvider() {
    return this.config.getProvider();
  }

  getCurrentModel() {
    return this.config.getModel();
  }
}