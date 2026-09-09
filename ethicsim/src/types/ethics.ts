export interface ChoiceOption {
  label: string;
  score: number;
  principle: string;
  feedback: string;
}

export interface ChoiceScenario {
  kind: 'choice';
  prompt: string;
  context: string;
  options: ChoiceOption[];
}

export interface SliderScenario {
  kind: 'slider';
  prompt: string;
  context: string;
  minLabel: string;
  maxLabel: string;
  ideal: number;
  principle: string;
  feedback: string;
}

export type Scenario = ChoiceScenario | SliderScenario;

export interface Topic {
  id: string;
  index: number;
  title: string;
  tagline: string;
  axis: string;
  short: string;
  minutes: number;
  intro: string[];
  scenarios: Scenario[];
}

export interface ResultsMap {
  [topicId: string]: number;
}