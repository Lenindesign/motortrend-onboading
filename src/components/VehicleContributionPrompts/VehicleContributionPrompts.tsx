import React, { useEffect, useRef, useState } from 'react';
import { AuthPromptModal } from '../AuthPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthPrompt } from '../../hooks/useAuthPrompt';

type Relationship = 'own' | 'want' | null;
type Props = {
  vehicleName: string;
  vehicleUrl: string;
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

export const VehicleContributionPrompts: React.FC<Props> = ({ vehicleName, vehicleUrl, relationship, repurchaseEligible = relationship === 'own', reliabilityEligible = relationship === 'own', onRelationshipChange, showRelationship = true, showRepurchase = true, showReliability = true }) => {
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
  const [submittedQuestion, setSubmittedQuestion] = useState(false);
  const [question, setQuestion] = useState('');
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
    if (!requireAuth('comment')) return;
    if (question.trim().length < 8) return;
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

  const renderPrompt = (type: 'repurchase' | 'reliability', title: string) => {
    const { total, yesPercent } = result(type);
    const answer = answers[type];
    return (
      <div className="vehicle-contributions__prompt" id={`vehicle-prompt-${type}`} key={type}>
        <div><strong>{title}</strong><span>Quick community question</span></div>
        {answer ? (
          <div className="vehicle-contributions__results" role="status">
            {total >= 10 ? <>
              <span>{yesPercent}% Yes</span><span>{100 - yesPercent}% No</span>
              <small>{total} responses · Your answer: {answer}</small>
              <div className="vehicle-contributions__bar"><i style={{ width: `${yesPercent}%` }} /></div>
            </> : <small>Your answer is saved. Results appear after 10 responses.</small>}
          </div>
        ) : (
          <div className="vehicle-contributions__answer-actions">
            <button type="button" onClick={() => submitAnswer(type, 'yes')}>Yes</button>
            <button type="button" onClick={() => submitAnswer(type, 'no')}>No</button>
          </div>
        )}
        <a className="vehicle-contributions__email-preview" href={`${vehicleUrl}?communityPrompt=${type}#vehicle-prompt-${type}`}>Email CTA preview ↗</a>
      </div>
    );
  };

  return (
    <section className="vehicle-contributions" aria-labelledby="vehicle-contributions-title">
      <span className="vehicle-contributions__eyebrow">Quick Selector</span>
      <h2 id="vehicle-contributions-title">What is your current relationship to this car?</h2>
      {showRelationship && <div className="vehicle-contributions__relationship">
        <p>Which best describes you?</p>
        <button type="button" aria-pressed={relationship === 'own'} className={relationship === 'own' ? 'is-selected' : ''} onClick={() => chooseRelationship('own')}><span aria-hidden="true">🔑</span> I own this car.</button>
        <button type="button" aria-pressed={relationship === 'want'} className={relationship === 'want' ? 'is-selected' : ''} onClick={() => chooseRelationship('want')}><span aria-hidden="true">😍</span> I’m interested in this car.</button>
      </div>}
      {confirmation && <p className="vehicle-contributions__confirmation" role="status">Added to your profile vehicle list. You can update this choice anytime.</p>}
      {(repurchaseEligible && showRepurchase || reliabilityEligible && showReliability) && (
        <>
          {repurchaseEligible && showRepurchase && renderPrompt('repurchase', 'Would you buy this car again?')}
          {reliabilityEligible && showReliability && <div className="vehicle-contributions__exploratory">
            <span>Exploratory · reliability prompt · signed-in profile ownership required</span>
            {!isAuthenticated ? <p>Sign in to confirm profile ownership before answering. Verification is simulated in this prototype.</p> : <>
            {renderPrompt('reliability', 'Has this car been reliable for you?')}
            <label htmlFor="vehicle-reliability-question">Share a reliability detail for the community Q&amp;A</label>
            {submittedQuestion ? <p className="vehicle-contributions__confirmation" role="status">Submitted for moderation. This won’t appear publicly until reviewed.</p> : (
              <div className="vehicle-contributions__question-form">
                <textarea id="vehicle-reliability-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} placeholder="What should future owners know?" />
                <button type="button" onClick={askQuestion} disabled={question.trim().length < 8}>Submit for review</button>
              </div>
            )}
            </>}
          </div>}
        </>
      )}
      <AuthPromptModal isOpen={isAuthPromptOpen} onClose={cancelAuthPrompt} onAuthRedirect={() => { authRedirectInProgress.current = true; }} action={promptAction} title="Join the MotorTrend community" description="Sign in or create a free account to add your vehicle and share your experience." contextId={`vehicle-contributions-${normalized}`} />
    </section>
  );
};
