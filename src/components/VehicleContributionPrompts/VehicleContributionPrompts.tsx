import React, { useEffect, useRef, useState } from 'react';
import { AuthPromptModal } from '../AuthPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthPrompt } from '../../hooks/useAuthPrompt';
import { Button, CardShell } from '../../design-system/components';

type Relationship = 'own' | 'want' | null;
type Props = {
  vehicleName: string;
  relationship: Relationship;
  repurchaseEligible?: boolean;
  reliabilityEligible?: boolean;
  onRelationshipChange: (relationship: Relationship) => void;
  showRelationship?: boolean;
  showRepurchase?: boolean;
  showReliability?: boolean;
};
type Answers = Record<string, 'yes' | 'no'>;
const answerKey = (vehicle: string) => `vehicle-contribution-answers:${vehicle}`;
const promptKey = (vehicle: string) => `vehicle-contribution-prompts:${vehicle}`;
const seedCounts = { repurchase: { yes: 18, no: 4 }, reliability: { yes: 22, no: 3 } };

export const VehicleContributionPrompts: React.FC<Props> = ({ vehicleName, relationship, repurchaseEligible = relationship === 'own', reliabilityEligible = relationship === 'own', onRelationshipChange, showRelationship = true, showRepurchase = true, showReliability = true }) => {
  const { isAuthenticated } = useAuth();
  const { isAuthPromptOpen, promptAction, requireAuth, closeAuthPrompt } = useAuthPrompt();
  const authRedirectInProgress = useRef(false);
  const [pending, setPending] = useState<Relationship | null>(() => {
    try {
      const value = sessionStorage.getItem(`vehicle-contribution-pending:${vehicleName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      return value === 'own' || value === 'want' ? value : null;
    } catch { return null; }
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const normalized = vehicleName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  useEffect(() => {
    try {
      setAnswers(JSON.parse(localStorage.getItem(answerKey(normalized)) || '{}'));
    } catch { setAnswers({}); }
  }, [normalized]);

  useEffect(() => {
    if (isAuthenticated && pending) {
      onRelationshipChange(pending);
      setConfirmation(true);
      setPending(null);
      try { sessionStorage.removeItem(`vehicle-contribution-pending:${normalized}`); } catch { /* local demo only */ }
    }
  }, [isAuthenticated, pending, normalized, onRelationshipChange]);

  const chooseRelationship = (next: Relationship) => {
    if (!requireAuth('default')) {
      setPending(next);
      try { if (next) sessionStorage.setItem(`vehicle-contribution-pending:${normalized}`, next); } catch { /* pending state remains in memory */ }
      return;
    }
    onRelationshipChange(next);
    setConfirmation(true);
  };

  const submitAnswer = (type: 'repurchase' | 'reliability', answer: 'yes' | 'no') => {
    if (!requireAuth('default')) return;
    const next = { ...answers, [type]: answer };
    setAnswers(next);
    try { localStorage.setItem(answerKey(normalized), JSON.stringify(next)); } catch { /* in-memory demo still works */ }
  };

  const askQuestion = () => {
    if (!requireAuth('comment') || question.trim().length < 8) return;
    try {
      const current = JSON.parse(localStorage.getItem(promptKey(normalized)) || '[]') as string[];
      localStorage.setItem(promptKey(normalized), JSON.stringify([...current, question.trim()]));
    } catch { /* local prototype state only */ }
    setSubmittedQuestion(true);
    setQuestion('');
  };

  const cancelAuthPrompt = () => {
    closeAuthPrompt();
    if (!isAuthenticated && pending && !authRedirectInProgress.current) {
      setPending(null);
      try { sessionStorage.removeItem(`vehicle-contribution-pending:${normalized}`); } catch { /* local demo only */ }
    }
  };

  const result = (type: 'repurchase' | 'reliability') => {
    const counts = { ...seedCounts[type] };
    const current = answers[type];
    if (current) counts[current] += 1;
    const total = counts.yes + counts.no;
    return { counts, total, yesPercent: Math.round(counts.yes / total * 100) };
  };
  const hasCommunityPrompts = (repurchaseEligible && showRepurchase) || (reliabilityEligible && showReliability);

  const renderPrompt = (type: 'repurchase' | 'reliability', title: string) => {
    const { counts, total, yesPercent } = result(type);
    const answer = answers[type];
    const repurchase = type === 'repurchase';
    const yesLabel = repurchase ? 'Yes, I would' : 'Yes';
    const noLabel = repurchase ? 'No, I wouldn’t' : 'No';
    return (
      <CardShell
        className={`vehicle-contributions__prompt ${repurchase ? 'vehicle-contributions__prompt--primary' : 'vehicle-contributions__prompt--secondary'}`}
        hasHover={false}
        background="var(--color-white)"
        padding="lg"
        noGap
        style={{ gap: 'var(--spacing-3)' }}
      >
        <div className="vehicle-contributions__prompt-heading">
          <span className="vehicle-contributions__prompt-eyebrow">{repurchase ? 'Owner sentiment · sample data' : 'Owner reliability · sample data'}</span>
          <h2 id={`vehicle-prompt-${type}`}>{repurchase ? 'Would you buy this car again?' : title}</h2>
          {answer ? (
            <p className="vehicle-contributions__prompt-summary">
              <strong>{yesPercent}%</strong>
              <span>{repurchase ? `of ${vehicleName} sample owners say they would buy it again` : 'of sample owners say this vehicle has been reliable'}</span>
            </p>
          ) : (
            <p className="vehicle-contributions__prompt-summary">{repurchase ? 'Vote to see how owners answered.' : 'Share what ownership has been like for you.'}</p>
          )}
        </div>

        {answer && (
          <div className="vehicle-contributions__results">
            <div className="vehicle-contributions__result-labels" aria-hidden="true">
              <span>Yes {yesPercent}%</span><span>No {100 - yesPercent}%</span>
            </div>
            <div
              className="vehicle-contributions__bar"
              role="img"
              aria-label={repurchase
                ? `${yesPercent}% of sample owners would buy this vehicle again; ${100 - yesPercent}% would not`
                : `${yesPercent}% of sample owners say this vehicle has been reliable; ${100 - yesPercent}% say it has not`}
            >
              <i style={{ width: `${yesPercent}%` }} />
            </div>
            <div className="vehicle-contributions__result-counts">
              <span>{repurchase ? `${counts.yes} would buy again · ${counts.no} would not` : `${counts.yes} say reliable · ${counts.no} say not`}</span>
              <span>Based on {total} sample responses</span>
            </div>
          </div>
        )}

        <div className="vehicle-contributions__vote-row">
          {answer ? (
            <p className="vehicle-contributions__confirmation" role="status">
              Your response is saved: {answer === 'yes' ? yesLabel : noLabel}.
            </p>
          ) : (
            <>
              <p>{repurchase ? 'Have you owned this vehicle?' : 'Sign in to confirm ownership and answer.'}</p>
              <div className="vehicle-contributions__answer-actions">
                <Button color="primary" variant="outline" size="default" onClick={() => submitAnswer(type, 'yes')}>{yesLabel}</Button>
                <Button color="neutrals3" variant="outline" size="default" onClick={() => submitAnswer(type, 'no')}>{noLabel}</Button>
              </div>
            </>
          )}
        </div>

        {!repurchase && isAuthenticated && (
          submittedQuestion ? (
            <p className="vehicle-contributions__confirmation" role="status">Thanks. Your detail was submitted for review.</p>
          ) : (
            <div className="vehicle-contributions__question-form">
              <label htmlFor="vehicle-reliability-question">What should future owners know?</label>
              <textarea id="vehicle-reliability-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} placeholder="Share a detail about your ownership experience" />
              <Button color="neutrals3" variant="outline" size="default" onClick={askQuestion} disabled={question.trim().length < 8}>Share a detail</Button>
            </div>
          )
        )}
      </CardShell>
    );
  };

  return (
    <>
      {(showRelationship || hasCommunityPrompts || confirmation) && (
        <section
          className={`vehicle-contributions ${showRelationship ? '' : 'vehicle-contributions--prompts'}`}
          aria-labelledby={showRelationship ? 'vehicle-contributions-title' : undefined}
          aria-label={showRelationship ? undefined : `${vehicleName} vehicle prompts`}
        >
          {showRelationship && (
            <>
              <span className="vehicle-contributions__eyebrow">Your vehicle list</span>
              <h2 id="vehicle-contributions-title">What’s your relationship to the {vehicleName}?</h2>
              <p className="vehicle-contributions__description">Choose a list for your profile. You can change this anytime.</p>
              <div className="vehicle-contributions__relationship" role="group" aria-label={`Choose how the ${vehicleName} fits you`}>
                <button
                  type="button"
                  aria-pressed={relationship === 'own'}
                  className={relationship === 'own' ? 'is-selected' : ''}
                  onClick={() => chooseRelationship('own')}
                >
                  <span className="vehicle-contributions__radio" aria-hidden="true" />
                  <span className="vehicle-contributions__choice-copy">
                    <strong>I own this car</strong>
                    <small>Add to Cars I Own</small>
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={relationship === 'want'}
                  className={relationship === 'want' ? 'is-selected' : ''}
                  onClick={() => chooseRelationship('want')}
                >
                  <span className="vehicle-contributions__radio" aria-hidden="true" />
                  <span className="vehicle-contributions__choice-copy">
                    <strong>I’m interested in this car</strong>
                    <small>Add to Cars I Want</small>
                  </span>
                </button>
              </div>
            </>
          )}
          {confirmation && <p className="vehicle-contributions__confirmation" role="status">Added to your profile vehicle list. You can update this choice anytime.</p>}
          {hasCommunityPrompts && (
            <>
              {repurchaseEligible && showRepurchase && renderPrompt('repurchase', 'Would you buy this car again?')}
              {reliabilityEligible && showReliability && renderPrompt('reliability', 'Has this car been reliable for you?')}
            </>
          )}
        </section>
      )}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={cancelAuthPrompt}
        onAuthRedirect={() => { authRedirectInProgress.current = true; }}
        action={promptAction}
        title="Join the MotorTrend community"
        description="Sign in or create a free account to add your vehicle and share your experience."
        contextId={`vehicle-contributions-${normalized}`}
      />
    </>
  );
};
