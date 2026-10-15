import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { TreeStructure, X } from '@phosphor-icons/react';
import { ModalShell } from '../atoms/ModalShell';
import { getAutosUgcBracketPreview } from '../../services/autosUgcBracketPreview';
import './BracketVoting.css';

type Generation = {
  id: string;
  seed: number;
  generation: number;
  years: string;
  name: string;
  image?: string;
  imageAlt?: string;
};
type Matchup = { id: string; first: string; second: string; votes: number[] };
type Round = {
  id: string;
  number: number;
  label: string;
  status: string;
  byes?: string[];
  matchups?: Matchup[];
};
type BracketPreview = {
  id: string;
  title: string;
  question: string;
  isMock: boolean;
  roundCount: number;
  rounds: Round[];
  generations: Generation[];
  tieBreakRule: string;
  preview: { matchupsPerView: number; shownMatchupIds: string[] };
};
type DemoState = { round: number; picks: Record<string, string>; reminderOptIn: boolean };
type ResolvedMatchup = { config: Matchup; first: Generation; second: Generation };

const bracket = getAutosUgcBracketPreview() as BracketPreview;
const storageKey = `motortrend-bracket-demo:${bracket.id}`;
const generationById = new Map(bracket.generations.map((generation) => [generation.id, generation]));
const defaultState: DemoState = { round: 1, picks: {}, reminderOptIn: false };

function readDemoState(): DemoState {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved) as Partial<DemoState>;
    return {
      round: bracket.rounds.some((round) => round.number === parsed.round) ? parsed.round! : 1,
      picks: parsed.picks && typeof parsed.picks === 'object' ? parsed.picks : {},
      reminderOptIn: Boolean(parsed.reminderOptIn),
    };
  } catch {
    return defaultState;
  }
}

function pickKey(round: number, matchupId: string) {
  return `${round}:${matchupId}`;
}

function resolveGeneration(reference: string, roundIndex: number, picks: Record<string, string>): Generation | undefined {
  const direct = generationById.get(reference);
  if (direct) return direct;
  if (!reference.startsWith('winner:')) return undefined;

  const matchupId = reference.slice('winner:'.length);
  for (let index = roundIndex - 1; index >= 0; index -= 1) {
    const previousRound = bracket.rounds[index];
    const previousMatchup = previousRound.matchups?.find((matchup) => matchup.id === matchupId);
    if (!previousMatchup) continue;
    const first = resolveGeneration(previousMatchup.first, index, picks);
    const second = resolveGeneration(previousMatchup.second, index, picks);
    if (!first || !second) return undefined;
    const selected = picks[pickKey(previousRound.number, previousMatchup.id)];
    const firstVotes = previousMatchup.votes[0] + Number(selected === first.id);
    const secondVotes = previousMatchup.votes[1] + Number(selected === second.id);
    if (firstVotes === secondVotes) return first.seed < second.seed ? first : second;
    return firstVotes > secondVotes ? first : second;
  }
  return undefined;
}

function formatVotes(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export const BracketVoting: React.FC = () => {
  const [demo, setDemo] = useState<DemoState>(readDemoState);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFullBracketOpen, setIsFullBracketOpen] = useState(false);
  const wasFullBracketOpen = useRef(false);
  const fullBracketTriggerRef = useRef<HTMLButtonElement>(null);
  const fullBracketCloseRef = useRef<HTMLButtonElement>(null);
  const fullBracketTitleId = `${useId().replace(/:/g, '')}-full-bracket-title`;
  const roundIndex = Math.max(0, bracket.rounds.findIndex((round) => round.number === demo.round));
  const activeRound = bracket.rounds[roundIndex];

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(demo));
    } catch {
      // Keep the interactive demo usable when browser storage is unavailable.
    }
  }, [demo]);

  useEffect(() => setPageIndex(0), [demo.round]);

  useEffect(() => {
    if (isFullBracketOpen) {
      wasFullBracketOpen.current = true;
      const focusTimer = window.setTimeout(() => fullBracketCloseRef.current?.focus(), 0);
      return () => window.clearTimeout(focusTimer);
    }
    if (wasFullBracketOpen.current) {
      wasFullBracketOpen.current = false;
      fullBracketTriggerRef.current?.focus();
    }
  }, [isFullBracketOpen]);

  const matchups = useMemo<ResolvedMatchup[]>(() => (activeRound.matchups ?? []).flatMap((config) => {
    const first = resolveGeneration(config.first, roundIndex, demo.picks);
    const second = resolveGeneration(config.second, roundIndex, demo.picks);
    return first && second ? [{ config, first, second }] : [];
  }), [activeRound, demo.picks, roundIndex]);

  const perPage = bracket.preview.matchupsPerView || 2;
  const pageCount = Math.max(1, Math.ceil(matchups.length / perPage));
  const visibleMatchups = matchups.slice(pageIndex * perPage, (pageIndex + 1) * perPage);
  const roundPicksComplete = matchups.length > 0 && matchups.every(({ config }) => demo.picks[pickKey(demo.round, config.id)]);
  const finalMatchup = activeRound.number === bracket.roundCount ? matchups[0] : undefined;

  const sampleRounds = useMemo(() => bracket.rounds.map((round, index) => ({
    ...round,
    matchups: (round.matchups ?? []).flatMap((config) => {
      const first = resolveGeneration(config.first, index, {});
      const second = resolveGeneration(config.second, index, {});
      if (!first || !second) return [];
      const winner = config.votes[0] === config.votes[1]
        ? (first.seed < second.seed ? first : second)
        : (config.votes[0] > config.votes[1] ? first : second);
      return [{ config, first, second, winner }];
    }),
  })), []);

  const selectOption = (matchupId: string, generationId: string) => {
    const key = pickKey(demo.round, matchupId);
    if (demo.picks[key]) return;
    setDemo((current) => ({ ...current, picks: { ...current.picks, [key]: generationId } }));
  };

  const resetDemo = () => {
    setDemo({ ...defaultState, picks: {} });
    setPageIndex(0);
  };

  const advanceRound = () => {
    setPageIndex(0);
    setDemo((current) => ({ ...current, round: current.round + 1 }));
  };

  const resultFor = ({ config, first, second }: ResolvedMatchup) => {
    const selected = demo.picks[pickKey(demo.round, config.id)];
    const firstVotes = config.votes[0] + Number(selected === first.id);
    const secondVotes = config.votes[1] + Number(selected === second.id);
    const total = firstVotes + secondVotes;
    const winner = firstVotes === secondVotes
      ? (first.seed < second.seed ? first : second)
      : (firstVotes > secondVotes ? first : second);
    return {
      selected,
      firstVotes,
      secondVotes,
      firstPercent: Math.round((firstVotes / total) * 100),
      secondPercent: Math.round((secondVotes / total) * 100),
      winner,
      tied: firstVotes === secondVotes,
    };
  };

  const showResults = (matchup: ResolvedMatchup) => Boolean(demo.picks[pickKey(demo.round, matchup.config.id)]);
  const finalOutcome = finalMatchup ? resultFor(finalMatchup) : undefined;

  return (
    <section className="bracket-voting" aria-labelledby="bracket-voting-title">
      <div className="bracket-voting__topline">
        <div className="bracket-voting__eyebrow-row">
          <span className="bracket-voting__eyebrow">Bracket voting</span>
        </div>
        <div className="bracket-voting__top-actions">
          <button
            type="button"
            className="bracket-voting__full-bracket"
            onClick={() => setIsFullBracketOpen(true)}
            ref={fullBracketTriggerRef}
          >
            <TreeStructure size={17} aria-hidden="true" />
            View full bracket
          </button>
          <button type="button" className="bracket-voting__reset" onClick={resetDemo}>Reset demo</button>
        </div>
      </div>

      <h2 id="bracket-voting-title">{bracket.title}</h2>
      <p className="bracket-voting__intro">Choose a generation in each matchup to see results and move through the bracket.</p>

      <div className="bracket-voting__progress" aria-label="Bracket progress">
        {bracket.rounds.map((round) => (
          <span
            className={`${round.number === demo.round ? 'is-current' : ''} ${round.number < demo.round ? 'is-complete' : ''}`}
            key={round.id}
            aria-current={round.number === demo.round ? 'step' : undefined}
          >
            {round.label}
          </span>
        ))}
      </div>

      <div className="bracket-voting__round-heading">
        <div>
          <strong>{activeRound.label}</strong>
          <span>{matchups.length} matchups · {Object.keys(demo.picks).filter((key) => key.startsWith(`${demo.round}:`)).length} of {matchups.length} picks</span>
        </div>
        <span className="bracket-voting__round-count">Round {demo.round} of {bracket.roundCount}</span>
      </div>
      {activeRound.byes?.length ? (
        <p className="bracket-voting__bye-note">Generations {activeRound.byes.map((id) => generationById.get(id)?.generation).join(' and ')} advance directly to the quarterfinals.</p>
      ) : null}

      <p className="bracket-voting__prompt" aria-live="polite">
        {roundPicksComplete
          ? demo.round === bracket.roundCount ? 'Your bracket is complete.' : 'Your picks are in. Review the sample results, then continue when you’re ready.'
          : 'Pick one generation in each matchup. Results appear after your pick.'}
      </p>

      <div className="bracket-voting__matchups">
        {visibleMatchups.map((matchup, visibleIndex) => {
          const outcome = resultFor(matchup);
          const resultsVisible = showResults(matchup);
          const pageMatchNumber = pageIndex * perPage + visibleIndex + 1;
          return (
            <article className="bracket-voting__matchup" key={matchup.config.id}>
              <span className="bracket-voting__match-label">Matchup {pageMatchNumber} of {matchups.length}</span>
              {[matchup.first, matchup.second].map((generation, optionIndex) => {
                const selected = outcome.selected === generation.id;
                const percent = optionIndex === 0 ? outcome.firstPercent : outcome.secondPercent;
                const votes = optionIndex === 0 ? outcome.firstVotes : outcome.secondVotes;
                return (
                  <button
                    className={`bracket-voting__option ${selected ? 'is-selected' : ''} ${resultsVisible ? 'has-results' : ''} ${resultsVisible && outcome.winner.id === generation.id ? 'is-leading' : ''}`}
                    type="button"
                    key={generation.id}
                    onClick={() => selectOption(matchup.config.id, generation.id)}
                    aria-pressed={selected}
                    disabled={Boolean(outcome.selected)}
                  >
                    {resultsVisible && <span className="bracket-voting__bar" style={{ width: `${percent}%` }} />}
                    <span className="bracket-voting__option-content">
                      <span className="bracket-voting__preview-seed">{generation.seed}</span>
                      {generation.image && <img src={generation.image} alt="" loading="lazy" />}
                      <span className="bracket-voting__preview-generation">
                        <span className="bracket-voting__option-title">
                          <strong>Generation {generation.generation}</strong>
                          {selected && <small className="bracket-voting__your-pick">Your pick</small>}
                        </span>
                        <small>{generation.name} · {generation.years}</small>
                      </span>
                    </span>
                    {resultsVisible ? (
                      <span className="bracket-voting__result-count">
                        <strong>{percent}%</strong>
                        <small>{formatVotes(votes)} votes</small>
                      </span>
                    ) : <span className="bracket-voting__option-prompt">Pick</span>}
                  </button>
                );
              })}
              {resultsVisible && (
                <p className="bracket-voting__result-note" role="status">
                  {outcome.tied
                    ? `Sample vote tied. Generation ${outcome.winner.generation} advances on the higher-seed tiebreak.`
                    : `Sample leader: Generation ${outcome.winner.generation}`}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {pageCount > 1 && (
        <div className="bracket-voting__pagination" aria-label="Matchup pages">
          <button type="button" onClick={() => setPageIndex((page) => Math.max(0, page - 1))} disabled={pageIndex === 0}>Previous matchups</button>
          <span>Page {pageIndex + 1} of {pageCount}</span>
          <button type="button" onClick={() => setPageIndex((page) => Math.min(pageCount - 1, page + 1))} disabled={pageIndex >= pageCount - 1}>Next matchups</button>
        </div>
      )}

      {roundPicksComplete && demo.round < bracket.roundCount && (
        <div className="bracket-voting__round-complete" role="status">
          <strong>{activeRound.label} complete</strong>
          <span>Sample vote leaders advance to the next round. Your picks are saved in this browser.</span>
          <button type="button" className="bracket-voting__advance" onClick={advanceRound}>
            Continue to {bracket.rounds[roundIndex + 1].label}
          </button>
        </div>
      )}

      {roundPicksComplete && finalMatchup && finalOutcome && (
        <div className="bracket-voting__champion" role="status" aria-live="polite">
          {finalOutcome.winner.image && (
            <figure className="bracket-voting__champion-image">
              <img src={finalOutcome.winner.image} alt={finalOutcome.winner.imageAlt || `Ford F-Series generation ${finalOutcome.winner.generation}`} loading="lazy" />
            </figure>
          )}
          <div className="bracket-voting__champion-copy">
            <span className="bracket-voting__champion-label">F-Series demo champion</span>
            <h3>Generation {finalOutcome.winner.generation}</h3>
            <p>{finalOutcome.winner.name} · {finalOutcome.winner.years}</p>
            <div className="bracket-voting__champion-result">
              <strong>{finalOutcome.winner.id === finalMatchup.first.id ? finalOutcome.firstPercent : finalOutcome.secondPercent}%</strong>
              <span>of {formatVotes(finalOutcome.firstVotes + finalOutcome.secondVotes)} sample votes</span>
            </div>
            <small>Based on the sample results and your picks in this demo.</small>
          </div>
        </div>
      )}

      {demo.round < bracket.roundCount && (
        <button
          type="button"
          className={`bracket-voting__reminder ${demo.reminderOptIn ? 'is-active' : ''}`}
          onClick={() => setDemo((current) => ({ ...current, reminderOptIn: !current.reminderOptIn }))}
          aria-pressed={demo.reminderOptIn}
        >
          <span aria-hidden="true">{demo.reminderOptIn ? '✓' : '+'}</span>
          {demo.reminderOptIn ? 'Reminder preference saved in this demo' : 'Get a reminder when the next round opens'}
        </button>
      )}

      <p className="bracket-voting__auth-note">Your demo picks stay in this browser and don’t count as live contest votes.</p>

      <ModalShell
        isOpen={isFullBracketOpen}
        onClose={() => setIsFullBracketOpen(false)}
        maxWidth="1120px"
        maxHeight="min(88vh, 900px)"
        width="calc(100% - 32px)"
        className="bracket-voting__full-bracket-modal"
        ariaLabelledBy={fullBracketTitleId}
      >
        <div className="bracket-voting__full-bracket-header">
          <div>
            <span className="bracket-voting__eyebrow">Sample bracket</span>
            <h2 id={fullBracketTitleId}>{bracket.question}</h2>
            <p>All 14 generations across four rounds. Red labels mark each sample winner and the champion.</p>
          </div>
          <button
            ref={fullBracketCloseRef}
            type="button"
            className="bracket-voting__full-bracket-close"
            onClick={() => setIsFullBracketOpen(false)}
            aria-label="Close full bracket"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="bracket-voting__full-bracket-scroll" tabIndex={0} aria-label="Full sample bracket, scroll horizontally to see each round">
          <div className="bracket-voting__full-bracket-rounds">
            {sampleRounds.map((round) => (
              <section className="bracket-voting__full-bracket-round" key={round.id} aria-label={round.label}>
                <h3>{round.label}</h3>
                <div className="bracket-voting__full-bracket-matches">
                  {round.matchups?.map(({ config, first, second, winner }, matchupIndex) => (
                    <article className="bracket-voting__full-bracket-match" key={config.id}>
                      <span className="bracket-voting__full-bracket-match-label">{round.label === 'Opening round' ? `Matchup ${matchupIndex + 1}` : `Match ${matchupIndex + 1}`}</span>
                      {[first, second].map((generation) => (
                        <div className={`bracket-voting__full-bracket-entry ${generation.id === winner.id ? 'is-sample-winner' : ''}`} key={generation.id}>
                          <span className="bracket-voting__full-bracket-seed">{generation.seed}</span>
                          <span><strong>Generation {generation.generation}</strong><small>{generation.name} · {generation.years}</small></span>
                          <span className="bracket-voting__full-bracket-statuses">
                            {round.number === 2 && bracket.rounds[0].byes?.includes(generation.id) && (
                              <span className="bracket-voting__full-bracket-bye">First-round bye</span>
                            )}
                            {generation.id === winner.id && (
                              <span className="bracket-voting__full-bracket-advances">
                                {round.number === bracket.roundCount ? 'Sample champion' : 'Advances'}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <p className="bracket-voting__full-bracket-note">Sample results are for illustration only. Your picks in the demo do not change this bracket.</p>
      </ModalShell>
    </section>
  );
};

export default BracketVoting;
