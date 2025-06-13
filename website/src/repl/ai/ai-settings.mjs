import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/react';
import { defaultSettings, settingsMap, useSettings as useCoreSettings } from '../../settings.mjs';

// AI-specific settings that extend core settings
export const aiDefaultSettings = {
  ...defaultSettings,
  activeFooter: 'AI', // Default to AI chat tab instead of intro
  panelWidth: 400, // AI chat panel width
};

// AI settings namespace - only contains AI-specific overrides
export const aiOnlySettings = {
  activeFooter: 'AI',
  panelWidth: 400,
};

let search = null;
if (typeof window !== 'undefined') {
  search = new URLSearchParams(window.location.search);
}

const instance = parseInt(search?.get('instance') ?? '0');
const ai_settings_key = `strudel-ai-settings${instance > 0 ? instance : ''}`;

export const aiSettingsMap = persistentMap(ai_settings_key, aiOnlySettings);

// Enhanced useSettings hook that merges core settings with AI-specific overrides
export function useAISettings() {
  const coreSettings = useCoreSettings();
  const aiSettings = useStore(aiSettingsMap);
  
  return {
    ...coreSettings,
    ...aiSettings,
  };
}

// AI-specific setting setters
export const setAIPanelWidth = (width) => aiSettingsMap.setKey('panelWidth', width);
export const setAIActiveFooter = (tab) => aiSettingsMap.setKey('activeFooter', tab);

// Re-export core settings functions for convenience
export {
  setPanelPinned,
  setIsPanelOpened,
  setIsZen,
} from '../../settings.mjs';