export type GamePhase =
  | 'TITLE_MENU'
  | 'SECTOR_MAP'
  | 'PLAYING'
  | 'PAUSED'
  | 'VICTORY_SUMMARY';

export interface ValidationCheck {
  id: string;
  description: string;
  type: 'STDOUT_CONTAINS' | 'STDOUT_EXACT' | 'VAR_EQUALS' | 'VAR_EXISTS' | 'FUNC_CALL';
  targetName?: string;
  expectedValue?: any;
  funcArgs?: any[];
}

export interface ValidationResult {
  id: string;
  description: string;
  passed: boolean;
  actualValue?: any;
  expectedValue?: any;
  detail: string;
}

export interface CodeDiagnostic {
  hasError: boolean;
  line?: number;
  errorType: 'SYNTAX' | 'RUNTIME' | 'LOGIC_MISMATCH' | 'EMPTY' | 'OK';
  title: string;
  explanation: string;
  howToFix: string;
  correctedLineExample?: string;
}

export interface ExecutionStep {
  stepIndex: number;
  line: number;
  actionType:
    | 'INIT'
    | 'VAR_ASSIGN'
    | 'CONDITION_EVAL'
    | 'LOOP_ITER'
    | 'FUNC_DEF'
    | 'FUNC_CALL'
    | 'FUNC_RETURN'
    | 'PRINT'
    | 'TEST_CHECK'
    | 'ERROR';
  variables: Record<string, any>;
  stdout: string[];
  logs: string[];
  message: string;
  impactWeight?: 'light' | 'medium' | 'heavy' | 'error';
  highlightVar?: string;
}

export interface ExecutionResult {
  success: boolean;
  victory: boolean;
  errorLine?: number;
  errorMessage?: string;
  diagnostic: CodeDiagnostic;
  steps: ExecutionStep[];
  stdout: string[];
  finalVariables: Record<string, any>;
  validationResults: ValidationResult[];
  totalCycles: number;
  codeLinesCount: number;
  rank: 'S' | 'A' | 'B' | 'FAIL';
  failureReason?: string;
}

export interface AutocompleteItem {
  label: string;
  insertText: string;
  category: 'funcion' | 'palabra_clave' | 'variable' | 'operador';
  signature: string;
  description: string;
}

export interface MissionHint {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
}

export interface CodexEntry {
  id: string;
  sector: number;
  title: string;
  syntax: string;
  summary: string;
  example: string;
}

export interface Mission {
  id: number;
  sectorId: number;
  sectorName: string;
  codeName: string;
  title: string;
  conceptTag: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  xpReward: number;
  parCycles: number;
  parLines: number;
  briefing: string;
  theoryTitle: string;
  theoryImage: string;
  theoryImageCaption: string;
  theoryContent: string[];
  theoryExample: string;
  objectives: string[];
  starterCode: string;
  solutionCode: string;
  validationChecks: ValidationCheck[];
  hints: MissionHint[];
  codexUnlockId: string;
}

export interface MissionRecord {
  missionId: number;
  completed: boolean;
  bestRank: 'S' | 'A' | 'B';
  bestCycles: number;
  bestLines: number;
  savedCode: string;
  unlockedHints: number;
}

export interface PlayerProgress {
  xp: number;
  completedMissions: Record<number, MissionRecord>;
  unlockedCodexIds: string[];
  currentMissionId: number;
  muted: boolean;
}
