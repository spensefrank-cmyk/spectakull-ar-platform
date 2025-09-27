export interface AICommand {
  id: string;
  command: string;
  timestamp: number;
  response: string;
  confidence: number;
  executed: boolean;
}

export interface MaterialSuggestion {
  name: string;
  properties: {
    color: string;
    metallic: number;
    roughness: number;
    emission?: string;
  };
  reason: string;
  confidence: number;
}

export interface LayoutSuggestion {
  type: 'spacing' | 'grouping' | 'hierarchy' | 'lighting';
  description: string;
  action: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PerformanceOptimization {
  type: 'geometry' | 'texture' | 'lighting' | 'physics';
  description: string;
  currentValue: number;
  suggestedValue: number;
  impact: string;
}

export interface AIAnalysis {
  sceneComplexity: 'low' | 'medium' | 'high';
  materialSuggestions: MaterialSuggestion[];
  layoutSuggestions: LayoutSuggestion[];
  performanceOptimizations: PerformanceOptimization[];
  accessibilityTips: string[];
  generalTips: string[];
}
