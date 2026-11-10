/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  HelpCircle,
  Play,
  RotateCcw,
  SkipForward,
  Terminal,
  Trophy,
  Volume2,
  VolumeX,
  Wrench,
  XCircle
} from 'lucide-react';
import { PythonEditor } from './components/PythonEditor';
import { TacticalCanvas } from './components/TacticalCanvas';
import { CODEX_ENTRIES, MISSIONS, RANK_TIERS } from './data/missions';
import { executePythonMission } from './engine/pythonInterpreter';
import {
  ExecutionResult,
  ExecutionStep,
  GamePhase,
  Mission,
  PlayerProgress
} from './types/game';
import { soundEngine } from './utils/sound';

const STORAGE_KEY = 'vertice_python_real_v3';

const DEFAULT_PROGRESS: PlayerProgress = {
  xp: 0,
  completedMissions: {},
  unlockedCodexIds: ['codex-print'],
  currentMissionId: 1,
  muted: false
};

function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedMissions: parsed.completedMissions || {},
      unlockedCodexIds: parsed.unlockedCodexIds || ['codex-print']
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('PLAYING');
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [activeMissionId, setActiveMissionId] = useState<number>(
    () => loadProgress().currentMissionId || 1
  );
  const [showCodexModal, setShowCodexModal] = useState<boolean>(false);

  const currentMission: Mission = useMemo(
    () => MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0],
    [activeMissionId]
  );

  const [codeMap, setCodeMap] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    const saved = loadProgress().completedMissions;
    for (const m of MISSIONS) {
      initial[m.id] = saved[m.id]?.savedCode || m.starterCode;
    }
    return initial;
  });

  const [unlockedHintTiers, setUnlockedHintTiers] = useState<Record<number, number>>({});

  // Execution & Playback State
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlayingSteps, setIsPlayingSteps] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const playbackTimerRef = useRef<number | null>(null);

  const currentCode = codeMap[currentMission.id] ?? currentMission.starterCode;
  const currentStep: ExecutionStep | null =
    execResult && execResult.steps[stepIdx] ? execResult.steps[stepIdx] : null;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  useEffect(() => {
    soundEngine.setMuted(progress.muted);
  }, [progress.muted]);

  const currentRank = useMemo(() => {
    let matched = RANK_TIERS[0];
    for (const tier of RANK_TIERS) {
      if (progress.xp >= tier.minXp) matched = tier;
    }
    return matched;
  }, [progress.xp]);

  const stopPlayback = useCallback(() => {
    if (playbackTimerRef.current) {
      window.clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setIsPlayingSteps(false);
  }, []);

  const resetSimulation = useCallback(() => {
    stopPlayback();
    setExecResult(null);
    setStepIdx(0);
  }, [stopPlayback]);

  const selectMission = useCallback(
    (missionId: number) => {
      stopPlayback();
      setActiveMissionId(missionId);
      setExecResult(null);
      setStepIdx(0);
      setPhase('PLAYING');
      setProgress((prev) => ({ ...prev, currentMissionId: missionId }));
    },
    [stopPlayback]
  );

  const handleExecutionFinished = useCallback(
    (result: ExecutionResult, mission: Mission, codeUsed: string) => {
      setIsPlayingSteps(false);
      if (result.victory && result.rank !== 'FAIL') {
        soundEngine.playVictory();
        const validRank = result.rank;
        setProgress((prev) => {
          const prevRec = prev.completedMissions[mission.id];
          const isFirstCompletion = !prevRec?.completed;
          const rankOrder = { S: 3, A: 2, B: 1 };
          const bestRank =
            prevRec && rankOrder[prevRec.bestRank] > rankOrder[validRank]
              ? prevRec.bestRank
              : validRank;

          const bonusXp = validRank === 'S' ? 50 : validRank === 'A' ? 25 : 0;
          const addedXp = isFirstCompletion
            ? mission.xpReward + bonusXp
            : !prevRec || rankOrder[validRank] > rankOrder[prevRec.bestRank]
              ? 35
              : 0;

          const nextCodex = prev.unlockedCodexIds.includes(mission.codexUnlockId)
            ? prev.unlockedCodexIds
            : [...prev.unlockedCodexIds, mission.codexUnlockId];

          return {
            ...prev,
            xp: prev.xp + addedXp,
            unlockedCodexIds: nextCodex,
            completedMissions: {
              ...prev.completedMissions,
              [mission.id]: {
                missionId: mission.id,
                completed: true,
                bestRank,
                bestCycles: prevRec
                  ? Math.min(prevRec.bestCycles, result.totalCycles)
                  : result.totalCycles,
                bestLines: prevRec
                  ? Math.min(prevRec.bestLines, result.codeLinesCount)
                  : result.codeLinesCount,
                savedCode: codeUsed,
                unlockedHints: unlockedHintTiers[mission.id] || 0
              }
            }
          };
        });
        setPhase('VICTORY_SUMMARY');
      } else {
        soundEngine.playError();
      }
    },
    [unlockedHintTiers]
  );

  const playStepAudio = useCallback((step: ExecutionStep) => {
    if (step.actionType === 'VAR_ASSIGN' || step.actionType === 'LOOP_ITER') {
      soundEngine.playMoveStep(step.stepIndex);
    } else if (step.actionType === 'CONDITION_EVAL' || step.actionType === 'FUNC_CALL') {
      soundEngine.playSensorRead();
    } else if (
      step.actionType === 'PRINT' ||
      step.actionType === 'FUNC_RETURN' ||
      step.actionType === 'TEST_CHECK'
    ) {
      soundEngine.playHeavyActivation();
    } else if (step.actionType === 'ERROR') {
      soundEngine.playError();
    }
  }, []);

  // Instant code analysis without waiting for step timer (for the "Analizar Mi Código" button)
  const handleAnalyzeCodeOnly = useCallback(() => {
    stopPlayback();
    const res = executePythonMission(currentCode, currentMission);
    setExecResult(res);
    setStepIdx(res.steps.length > 0 ? res.steps.length - 1 : 0);
    if (res.diagnostic.hasError) {
      soundEngine.playError();
    } else {
      soundEngine.playAutocomplete();
    }
  }, [currentCode, currentMission, stopPlayback]);

  const handleRunCode = useCallback(() => {
    stopPlayback();
    const res = executePythonMission(currentCode, currentMission);
    setExecResult(res);
    setStepIdx(0);

    setProgress((prev) => ({
      ...prev,
      completedMissions: {
        ...prev.completedMissions,
        [currentMission.id]: {
          missionId: currentMission.id,
          completed: prev.completedMissions[currentMission.id]?.completed || false,
          bestRank: prev.completedMissions[currentMission.id]?.bestRank || 'B',
          bestCycles: prev.completedMissions[currentMission.id]?.bestCycles || 999,
          bestLines: prev.completedMissions[currentMission.id]?.bestLines || 999,
          savedCode: currentCode,
          unlockedHints: unlockedHintTiers[currentMission.id] || 0
        }
      }
    }));

    if (res.steps.length <= 1) {
      handleExecutionFinished(res, currentMission, currentCode);
      return;
    }

    setIsPlayingSteps(true);
    let idx = 0;
    const intervalMs = playbackSpeed === 2 ? 140 : 260;

    playbackTimerRef.current = window.setInterval(() => {
      idx++;
      if (idx < res.steps.length) {
        setStepIdx(idx);
        playStepAudio(res.steps[idx]);
      } else {
        if (playbackTimerRef.current) {
          window.clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
        handleExecutionFinished(res, currentMission, currentCode);
      }
    }, intervalMs);
  }, [
    currentCode,
    currentMission,
    handleExecutionFinished,
    playStepAudio,
    playbackSpeed,
    stopPlayback,
    unlockedHintTiers
  ]);

  const handleStepForward = useCallback(() => {
    stopPlayback();
    if (!execResult) {
      const res = executePythonMission(currentCode, currentMission);
      setExecResult(res);
      if (res.steps.length > 1) {
        setStepIdx(1);
        playStepAudio(res.steps[1]);
      } else {
        handleExecutionFinished(res, currentMission, currentCode);
      }
      return;
    }

    if (stepIdx + 1 < execResult.steps.length) {
      const next = stepIdx + 1;
      setStepIdx(next);
      playStepAudio(execResult.steps[next]);
      if (next === execResult.steps.length - 1) {
        handleExecutionFinished(execResult, currentMission, currentCode);
      }
    }
  }, [
    currentCode,
    currentMission,
    execResult,
    handleExecutionFinished,
    playStepAudio,
    stepIdx,
    stopPlayback
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCodexModal) {
        setShowCodexModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showCodexModal]);

  const toggleMute = () => {
    setProgress((prev) => ({ ...prev, muted: !prev.muted }));
  };

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({ ...prev, [currentMission.id]: newCode }));
    if (execResult) {
      resetSimulation();
    }
  };

  const unlockNextHint = () => {
    const currentTier = unlockedHintTiers[currentMission.id] || 0;
    if (currentTier < 3) {
      soundEngine.playAutocomplete();
      setUnlockedHintTiers((prev) => ({
        ...prev,
        [currentMission.id]: currentTier + 1
      }));
    }
  };

  const completedCount = Object.values(progress.completedMissions).filter(
    (m) => m.completed
  ).length;

  const isExecutionAtEnd =
    execResult &&
    (execResult.steps.length === 0 || stepIdx === execResult.steps.length - 1);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0B0F17] text-[#F1F5F9] flex flex-col select-none">
      {/* =====================================================================
          TOP NAVIGATION & DIRECT MISSION SELECTOR BAR
      ===================================================================== */}
      <header className="flex items-center justify-between gap-4 px-5 py-2.5 bg-[#151C28] border-b border-[#263244] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setPhase(phase === 'SECTOR_MAP' ? 'PLAYING' : 'SECTOR_MAP')}
            className="flex items-center gap-2 text-base font-display font-bold tracking-tight text-[#F8FAFC] hover:text-[#F59E0B] transition-colors cursor-pointer shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <polygon
                points="24,3 44,14.5 44,33.5 24,45 4,33.5 4,14.5"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="#0B0F17"
              />
              <path
                d="M17 19L24 31L31 19"
                stroke="#F8FAFC"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>VÉRTICE · PYTHON 3</span>
          </button>

          <span className="text-[#263244]" aria-hidden="true">
            |
          </span>

          <div className="flex items-center gap-1.5 bg-[#0B0F17] border border-[#263244] rounded-md p-1">
            <button
              type="button"
              disabled={currentMission.id <= 1}
              onClick={() => selectMission(currentMission.id - 1)}
              className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Nivel Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={currentMission.id}
              onChange={(e) => selectMission(Number(e.target.value))}
              aria-label="Seleccionar nivel"
              className="bg-transparent text-xs font-mono font-semibold text-[#F8FAFC] px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              {MISSIONS.map((m) => {
                const done = progress.completedMissions[m.id]?.completed;
                return (
                  <option key={m.id} value={m.id} className="bg-[#151C28] text-[#F8FAFC]">
                    {done ? '✓ ' : ''}Nivel {String(m.id).padStart(2, '0')}: {m.title} ({m.conceptTag})
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              disabled={currentMission.id >= MISSIONS.length}
              onClick={() => selectMission(currentMission.id + 1)}
              className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Siguiente Nivel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
          <span>{currentRank.title}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F59E0B] font-semibold tabular-nums">{progress.xp} XP</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#10B981] tabular-nums">
            {completedCount}/{MISSIONS.length} Niveles Superados
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPhase(phase === 'SECTOR_MAP' ? 'PLAYING' : 'SECTOR_MAP')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              phase === 'SECTOR_MAP'
                ? 'bg-[#F59E0B] text-[#0B0F17] border-[#F59E0B] font-semibold'
                : 'bg-[#0B0F17] hover:bg-[#1E293B] text-[#CBD5E1] border-[#263244]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {phase === 'SECTOR_MAP' ? 'Volver al Editor' : 'Mapa de Niveles'}
          </button>

          <button
            type="button"
            onClick={() => setShowCodexModal(true)}
            className="px-3 py-1.5 text-xs font-mono text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#0B0F17] hover:bg-[#1E293B] border border-[#263244] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            Chuleta Python
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0B0F17] border border-[#263244] rounded-md transition-colors cursor-pointer"
            title={progress.muted ? 'Activar Sonido' : 'Silenciar'}
          >
            {progress.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE: UNIFIED 3-COLUMN STUDIO
      ===================================================================== */}
      {phase !== 'SECTOR_MAP' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* -----------------------------------------------------------------
              COLUMN 1 (Left, 4 cols): THEORY, STEPS & HINTS
          ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 h-full border-r border-[#263244] bg-[#101622] flex flex-col overflow-hidden select-text">
            <div className="px-4 py-3 bg-[#151C28] border-b border-[#263244] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-[#38BDF8] font-semibold">
                  {currentMission.sectorName}
                </div>
                <h1 className="text-lg font-display font-bold text-[#F8FAFC]">
                  Nivel {currentMission.id}: {currentMission.title}
                </h1>
              </div>
              <span className="text-xs font-mono text-[#F59E0B] font-semibold tabular-nums shrink-0">
                +{currentMission.xpReward} XP
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 1. FIRST: Level Explanation with Visual Concept Image */}
              <div className="p-3.5 bg-[#151C28]/70 border border-[#263244] rounded-lg space-y-3">
                <div className="text-xs font-mono font-semibold text-[#F59E0B]">
                  EXPLICACIÓN: {currentMission.theoryTitle}
                </div>

                {/* Level Visual Illustration */}
                <div className="relative rounded-md overflow-hidden border border-[#263244] bg-[#0B0F17]">
                  <img
                    src={currentMission.theoryImage}
                    alt={currentMission.theoryTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover block"
                  />
                  <div className="px-3 py-1.5 bg-[#0B0F17]/90 border-t border-[#263244] text-[11px] font-mono text-[#38BDF8] leading-snug">
                    {currentMission.theoryImageCaption}
                  </div>
                </div>

                <div className="space-y-2">
                  {currentMission.theoryContent.map((p, idx) => (
                    <p key={idx} className="text-sm text-[#CBD5E1] leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* 2. SECOND: Exercise & Objectives to Perform */}
              <div className="p-3.5 bg-[#151C28] border border-[#38BDF8]/40 rounded-lg space-y-2.5">
                <div className="text-xs font-mono font-bold text-[#38BDF8]">
                  EJERCICIO A REALIZAR
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {currentMission.briefing}
                </p>
                <ol className="space-y-1.5 pt-2 border-t border-[#263244]">
                  {currentMission.objectives.map((obj, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-[#F8FAFC] leading-snug"
                    >
                      <span className="font-mono text-xs font-bold text-[#F59E0B] mt-0.5 tabular-nums shrink-0">
                        {idx + 1}.
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 3. THIRD: Progressive Hints (including the functional example inside the hints) */}
              <div className="p-3.5 bg-[#151C28] border border-[#263244] rounded-lg space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#10B981]">
                    <HelpCircle className="w-4 h-4" />
                    <span>PISTAS ({unlockedHintTiers[currentMission.id] || 0}/3)</span>
                  </div>

                  {(unlockedHintTiers[currentMission.id] || 0) < 3 && (
                    <button
                      type="button"
                      onClick={unlockNextHint}
                      className="px-2.5 py-1 bg-[#0B0F17] hover:bg-[#1E293B] text-[#F59E0B] border border-[#F59E0B]/40 rounded text-xs font-mono font-semibold transition-colors cursor-pointer"
                    >
                      Mostrar Pista {(unlockedHintTiers[currentMission.id] || 0) + 1}
                    </button>
                  )}
                </div>

                {(unlockedHintTiers[currentMission.id] || 0) === 0 ? (
                  <p className="text-xs text-[#94A3B8]">
                    Si necesitas ayuda adicional o ver un ejemplo funcional similar, desbloquea las
                    pistas progresivas aquí.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {currentMission.hints
                      .filter((h) => h.tier <= (unlockedHintTiers[currentMission.id] || 0))
                      .map((hint) => (
                        <div
                          key={hint.tier}
                          className="p-3 bg-[#0B0F17] border border-[#263244] rounded space-y-2"
                        >
                          <div className="text-xs font-mono font-semibold text-[#38BDF8]">
                            Pista {hint.tier}: {hint.title}
                          </div>
                          <p className="text-xs text-[#CBD5E1] leading-relaxed">{hint.content}</p>
                          {hint.tier === 3 && (
                            <div className="pt-1">
                              <div className="text-[11px] font-mono text-[#94A3B8] mb-1">
                                EJEMPLO FUNCIONAL SIMILAR EN PYTHON:
                              </div>
                              <pre className="p-2.5 bg-[#151C28] border border-[#263244] rounded font-mono text-xs text-[#10B981] overflow-x-auto leading-relaxed">
                                {currentMission.theoryExample}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              COLUMN 2 (Center, 4 cols): REAL PYTHON 3 CODE EDITOR + SMART REVIEW
          ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 h-full border-r border-[#263244] bg-[#0B0F17] flex flex-col overflow-hidden p-3 gap-3">
            <div className="flex-1 min-h-0">
              <PythonEditor
                code={currentCode}
                onChange={handleCodeChange}
                onRunShortcut={handleRunCode}
                onAnalyzeCode={handleAnalyzeCodeOnly}
                onResetStarter={() => handleCodeChange(currentMission.starterCode)}
                activeLine={currentStep?.line}
                errorLine={execResult?.errorLine}
              />
            </div>

            {/* Unified Smart Diagnostic & Code Review Box + Run Buttons */}
            <div className="p-3 bg-[#151C28] border border-[#263244] rounded-lg flex flex-col gap-3 shrink-0 select-text">
              {execResult?.diagnostic && execResult.diagnostic.hasError && (
                <div className="p-3.5 bg-[#EF4444]/12 border border-[#EF4444]/45 rounded-md space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-[#EF4444]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>REVISIÓN: {execResult.diagnostic.title}</span>
                  </div>

                  <p className="text-[#E2E8F0] leading-relaxed">
                    {execResult.diagnostic.explanation}
                  </p>

                  {/* Explicit Solution to the User's Specific Mistake */}
                  <div className="p-2.5 bg-[#0B0F17] border border-[#10B981]/40 rounded space-y-1.5">
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-[#10B981]">
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      <span>CÓMO CORREGIR TU FALLO:</span>
                    </div>
                    <p className="text-[#CBD5E1] leading-relaxed">
                      {execResult.diagnostic.howToFix}
                    </p>
                    {execResult.diagnostic.correctedLineExample && (
                      <div className="pt-1">
                        <span className="text-[11px] font-mono text-[#94A3B8] block mb-1">
                          Ejemplo corrigiendo tu línea:
                        </span>
                        <code className="block px-2.5 py-1.5 bg-[#151C28] border border-[#263244] rounded font-mono text-xs text-[#F59E0B]">
                          {execResult.diagnostic.correctedLineExample}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {execResult?.diagnostic && !execResult.diagnostic.hasError && (
                <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/45 rounded-md flex items-center gap-2 text-xs font-mono text-[#10B981]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{execResult.diagnostic.title}: {execResult.diagnostic.explanation}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunCode}
                  className="flex-1 py-3 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0F17] font-display font-bold text-sm rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isPlayingSteps ? 'Ejecutando...' : 'EJECUTAR CÓDIGO PYTHON'}
                </button>

                <button
                  type="button"
                  onClick={handleStepForward}
                  className="py-3 px-3.5 bg-[#0B0F17] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#263244] font-mono text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Ejecuta tu script línea por línea"
                >
                  <SkipForward className="w-4 h-4 text-[#38BDF8]" />
                  Paso a Paso
                </button>

                <button
                  type="button"
                  onClick={resetSimulation}
                  className="py-3 px-3 bg-[#0B0F17] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263244] font-mono text-xs rounded-md transition-colors cursor-pointer shrink-0"
                  title="Limpiar análisis"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              COLUMN 3 (Right, 4 cols): LIVE VISUALIZER, STDOUT & TESTS
          ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 h-full bg-[#0B0F17] flex flex-col overflow-hidden">
            {/* Top 44%: 60fps Data Flow & Validation Nodes Visualizer */}
            <div className="h-[44%] relative border-b border-[#263244]">
              <TacticalCanvas
                mission={currentMission}
                currentStep={currentStep}
                execResult={execResult}
                isExecuting={isPlayingSteps}
              />
            </div>

            {/* Bottom 56%: Real Python stdout Console + Automated Test Checklist */}
            <div className="h-[56%] bg-[#101622] p-3.5 flex flex-col gap-3 overflow-y-auto font-mono text-xs select-text">
              {/* 1. Standard Output (stdout from print) */}
              <div className="p-3 bg-[#0B0F17] border border-[#263244] rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#38BDF8]">
                    <Terminal className="w-3.5 h-3.5" />
                    SALIDA DE CONSOLA PYTHON (print)
                  </span>
                  <span>stdout</span>
                </div>

                {currentStep && currentStep.stdout.length > 0 ? (
                  <div className="p-2.5 bg-[#151C28] rounded border border-[#10B981]/40 text-sm text-[#10B981] font-bold space-y-1">
                    {currentStep.stdout.map((outLine, i) => (
                      <div key={i}>&gt; {outLine}</div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#151C28]/50 rounded text-[#64748B]">
                    (Sin salida en pantalla todavía. Usa print() y ejecuta tu código).
                  </div>
                )}
              </div>

              {/* 2. Automated Unit Test Checklist */}
              <div className="p-3 bg-[#151C28] border border-[#263244] rounded-lg space-y-2">
                <div className="text-[11px] font-semibold text-[#F59E0B]">
                  PRUEBAS DE VERIFICACIÓN DEL NIVEL
                </div>
                <div className="space-y-2">
                  {currentMission.validationChecks.map((chk, idx) => {
                    const resItem = isExecutionAtEnd
                      ? execResult?.validationResults[idx]
                      : undefined;
                    return (
                      <div
                        key={chk.id}
                        className={`p-2.5 rounded border flex items-start gap-2.5 ${
                          resItem?.passed
                            ? 'bg-[#10B981]/12 border-[#10B981]/50 text-[#F8FAFC]'
                            : resItem && !resItem.passed
                              ? 'bg-[#EF4444]/12 border-[#EF4444]/50 text-[#FCA5A5]'
                              : 'bg-[#0B0F17] border-[#263244] text-[#CBD5E1]'
                        }`}
                      >
                        {resItem?.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        ) : resItem && !resItem.passed ? (
                          <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-[#64748B] flex items-center justify-center text-[10px] text-[#94A3B8] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                        )}
                        <div className="space-y-0.5">
                          <div className="font-sans text-xs font-semibold">
                            {chk.description}
                          </div>
                          {resItem && (
                            <div className="text-[11px] text-[#94A3B8]">{resItem.detail}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Live Variables Table */}
              <div className="p-3 bg-[#0B0F17] border border-[#263244] rounded-lg space-y-1.5">
                <div className="text-[11px] font-semibold text-[#94A3B8]">
                  VARIABLES EN MEMORIA
                </div>
                {currentStep && Object.keys(currentStep.variables).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(currentStep.variables).map(([k, v]) => (
                      <div
                        key={k}
                        className="px-2.5 py-1.5 bg-[#151C28] border border-[#263244] rounded flex items-center justify-between gap-2"
                      >
                        <span className="text-[#38BDF8] font-semibold truncate">{k}</span>
                        <span className="text-[#F8FAFC] font-bold tabular-nums">
                          {JSON.stringify(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#64748B]">Ninguna variable creada aún.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CAMPAIGN MAP VIEW
      ===================================================================== */}
      {phase === 'SECTOR_MAP' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0B0F17]">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-5 bg-[#151C28] border border-[#263244] rounded-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#38BDF8] mb-1">
                  CURSO PRÁCTICO DE PYTHON 3 DESDE CERO
                </div>
                <h2 className="text-2xl font-display font-bold text-[#F8FAFC]">
                  Mapa de los 10 Niveles de Python Real
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1">
                  Haz clic en cualquier nivel para practicar código Python 100% real y funcional.
                </p>
              </div>

              <div className="flex items-center gap-6 font-mono">
                <div>
                  <div className="text-xs text-[#94A3B8]">EXPERIENCIA</div>
                  <div className="text-2xl font-bold text-[#F59E0B] tabular-nums">
                    {progress.xp} XP
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#94A3B8]">SUPERADOS</div>
                  <div className="text-2xl font-bold text-[#10B981] tabular-nums">
                    {completedCount} / {MISSIONS.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MISSIONS.map((m) => {
                const rec = progress.completedMissions[m.id];
                const isDone = Boolean(rec?.completed);
                const isCurrent = m.id === currentMission.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => selectMission(m.id)}
                    className={`p-5 bg-[#151C28] border rounded-lg transition-colors cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#F59E0B]'
                        : 'border-[#263244] hover:border-[#38BDF8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-[#38BDF8] font-semibold">
                          NIVEL {String(m.id).padStart(2, '0')} · {m.conceptTag}
                        </span>
                        {isDone ? (
                          <span className="text-[#10B981] font-bold">
                            ✓ SUPERADO (RANGO {rec.bestRank})
                          </span>
                        ) : (
                          <span className="text-[#F59E0B]">+{m.xpReward} XP</span>
                        )}
                      </div>

                      <h3 className="text-lg font-display font-bold text-[#F8FAFC] mb-1.5">
                        {m.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{m.briefing}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#263244]">
                      <span className="text-xs font-mono text-[#64748B]">{m.sectorName}</span>
                      <span className="text-xs font-mono font-semibold text-[#F59E0B] flex items-center gap-1">
                        Ir al Nivel <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VICTORY MODAL
      ===================================================================== */}
      {phase === 'VICTORY_SUMMARY' && execResult && (
        <div className="fixed inset-0 z-50 bg-[#0B0F17]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#151C28] border border-[#10B981] rounded-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10B981] mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡NIVEL {String(currentMission.id).padStart(2, '0')} COMPLETADO!</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-[#F8FAFC]">
                  {currentMission.title}
                </h2>
              </div>

              <div className="px-3.5 py-2 bg-[#0B0F17] border border-[#263244] rounded text-center shrink-0">
                <div className="text-[10px] font-mono text-[#94A3B8]">EFICIENCIA</div>
                <div className="text-2xl font-display font-bold text-[#F59E0B]">
                  RANGO {execResult.rank}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0B0F17] border border-[#10B981]/40 rounded font-mono text-xs space-y-1">
              <div className="text-[#94A3B8]">SALIDA GENERADA POR TU CÓDIGO:</div>
              <div className="text-sm font-bold text-[#10B981]">
                &gt; {execResult.stdout.join(' | ')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 bg-[#0B0F17] border border-[#263244] rounded">
                <div className="text-[11px] text-[#94A3B8]">PASOS</div>
                <div className="text-lg font-bold text-[#F8FAFC] tabular-nums">
                  {execResult.totalCycles}
                </div>
              </div>
              <div className="p-3 bg-[#0B0F17] border border-[#263244] rounded">
                <div className="text-[11px] text-[#94A3B8]">LÍNEAS</div>
                <div className="text-lg font-bold text-[#38BDF8] tabular-nums">
                  {execResult.codeLinesCount}
                </div>
              </div>
              <div className="p-3 bg-[#0B0F17] border border-[#263244] rounded">
                <div className="text-[11px] text-[#94A3B8]">RECOMPENSA</div>
                <div className="text-lg font-bold text-[#10B981] tabular-nums">
                  +{currentMission.xpReward} XP
                </div>
              </div>
            </div>

            {(() => {
              const codexItem = CODEX_ENTRIES.find(
                (c) => c.id === currentMission.codexUnlockId
              );
              if (!codexItem) return null;
              return (
                <div className="p-3.5 bg-[#0B0F17] border border-[#263244] rounded space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F59E0B]">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>CONCEPTO DOMINADO: {codexItem.title}</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">{codexItem.summary}</p>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhase('PLAYING')}
                className="px-4 py-2.5 bg-[#0B0F17] hover:bg-[#1E293B] text-[#CBD5E1] border border-[#263244] font-mono text-xs rounded-md cursor-pointer"
              >
                Seguir Editando
              </button>

              {currentMission.id < MISSIONS.length ? (
                <button
                  type="button"
                  onClick={() => selectMission(currentMission.id + 1)}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] font-display font-bold text-sm rounded-md flex items-center gap-2 cursor-pointer"
                >
                  Siguiente Nivel ({currentMission.id + 1})
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhase('SECTOR_MAP')}
                  className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0F17] font-display font-bold text-sm rounded-md cursor-pointer"
                >
                  Ver Mapa Completo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PYTHON CHEATSHEET MODAL
      ===================================================================== */}
      {showCodexModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0F17]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-[#151C28] border border-[#263244] rounded-lg flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#263244] flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#38BDF8]">
                  REFERENCIA DE SINTAXIS ESTÁNDAR PYTHON 3
                </div>
                <h2 className="text-xl font-display font-bold text-[#F8FAFC]">
                  Chuleta de Comandos Reales de Python
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCodexModal(false)}
                className="px-3 py-1.5 bg-[#0B0F17] hover:bg-[#1E293B] text-[#CBD5E1] border border-[#263244] rounded text-xs font-mono cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 select-text">
              {CODEX_ENTRIES.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg border bg-[#0B0F17] border-[#263244] space-y-2"
                >
                  <div className="text-sm font-display font-bold text-[#F59E0B]">
                    Módulo 0{entry.sector} · {entry.title}
                  </div>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">{entry.summary}</p>
                  <pre className="p-3 bg-[#151C28] border border-[#263244] rounded font-mono text-xs text-[#10B981] overflow-x-auto">
                    {entry.example}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
