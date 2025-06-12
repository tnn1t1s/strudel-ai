// AI Configuration and Provider Management
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic'
};

export const AI_MODELS = {
  [AI_PROVIDERS.OPENAI]: {
    'gpt-4': { name: 'GPT-4', maxTokens: 8192, costTier: 'high' },
    'gpt-4-turbo': { name: 'GPT-4 Turbo', maxTokens: 128000, costTier: 'high' },
    'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', maxTokens: 16385, costTier: 'low' }
  },
  [AI_PROVIDERS.ANTHROPIC]: {
    'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', maxTokens: 200000, costTier: 'high' },
    'claude-3-opus-20240229': { name: 'Claude 3 Opus', maxTokens: 200000, costTier: 'high' },
    'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', maxTokens: 200000, costTier: 'low' }
  }
};

export const DEFAULT_AI_CONFIG = {
  provider: AI_PROVIDERS.OPENAI,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  timeout: 30000
};

export class AIConfig {
  constructor(config = {}) {
    this.config = { ...DEFAULT_AI_CONFIG, ...config };
  }

  getProvider() {
    return this.config.provider;
  }

  getModel() {
    return this.config.model;
  }

  getModelInfo() {
    return AI_MODELS[this.config.provider][this.config.model];
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(updates) {
    this.config = { ...this.config, ...updates };
  }

  isValidConfig() {
    const { provider, model } = this.config;
    return AI_MODELS[provider] && AI_MODELS[provider][model];
  }

  getApiKey() {
    const { provider } = this.config;
    if (provider === AI_PROVIDERS.OPENAI) {
      return import.meta.env.PUBLIC_OPENAI_API_KEY;
    }
    if (provider === AI_PROVIDERS.ANTHROPIC) {
      return import.meta.env.PUBLIC_ANTHROPIC_API_KEY;
    }
    return null;
  }
}