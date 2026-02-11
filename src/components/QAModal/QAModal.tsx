/**
 * Q&A Modal Component
 * Modal for asking questions, viewing answers, and browsing common Q&A on article pages
 * Includes AI-powered auto-answer feature
 */

import React, { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import { ModalShell } from '../atoms/ModalShell';

export interface QAItem {
  id: string;
  question: string;
  author: string;
  authorAvatar?: string;
  date: string;
  upvotes: number;
  answers: QAAnswer[];
  isEditorPick?: boolean;
}

export interface QAAnswer {
  id: string;
  text: string;
  author: string;
  authorAvatar?: string;
  isEditor?: boolean;
  isAI?: boolean;
  date: string;
  upvotes: number;
}

export interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  articleSlug: string;
  vehicleName?: string;
  questions: QAItem[];
  onSubmitQuestion: (question: string) => void;
  onSubmitAnswer: (questionId: string, answer: string) => void;
  onUpvoteQuestion: (questionId: string) => void;
  onUpvoteAnswer: (questionId: string, answerId: string) => void;
  onAskAI?: (questionId: string, questionText: string) => void;
}

export const QAModal: React.FC<QAModalProps> = ({
  isOpen,
  onClose,
  articleTitle,
  vehicleName,
  questions,
  onSubmitQuestion,
  onSubmitAnswer,
  onUpvoteQuestion,
  onUpvoteAnswer,
  onAskAI,
}) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'unanswered'>('popular');
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredUpvote, setHoveredUpvote] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [aiLoadingQuestionId, setAiLoadingQuestionId] = useState<string | null>(null);
  const [hoveredAiBtn, setHoveredAiBtn] = useState<string | null>(null);
  const [askAIWithQuestion, setAskAIWithQuestion] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && questionInputRef.current) {
      setTimeout(() => questionInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Sort questions based on active tab
  const sortedQuestions = [...questions].sort((a, b) => {
    if (activeTab === 'popular') return b.upvotes - a.upvotes;
    if (activeTab === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (activeTab === 'unanswered') return a.answers.length - b.answers.length;
    return 0;
  });

  const handleSubmitQuestion = (withAI = false) => {
    if (!newQuestion.trim()) return;
    setIsSubmitting(true);
    setAskAIWithQuestion(withAI);
    onSubmitQuestion(newQuestion.trim());
    setNewQuestion('');
    setTimeout(() => {
      setIsSubmitting(false);
      setAskAIWithQuestion(false);
    }, 500);
  };

  // Trigger AI for the most recently added question after submission
  useEffect(() => {
    if (askAIWithQuestion && !isSubmitting && questions.length > 0) {
      // Find the most recent user question
      const userQuestions = questions.filter(q => q.author === 'You');
      if (userQuestions.length > 0) {
        const latestQ = userQuestions[0];
        if (!latestQ.answers.some(a => a.isAI)) {
          handleAskAI(latestQ.id, latestQ.question);
        }
      }
      setAskAIWithQuestion(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, isSubmitting, askAIWithQuestion]);

  const handleSubmitAnswer = (questionId: string) => {
    if (!answerText.trim()) return;
    onSubmitAnswer(questionId, answerText.trim());
    setAnswerText('');
  };

  const handleAskAI = (questionId: string, questionText: string) => {
    setAiLoadingQuestionId(questionId);
    setExpandedQuestion(questionId);
    
    // Simulate AI thinking delay, then call the parent handler
    setTimeout(() => {
      if (onAskAI) {
        onAskAI(questionId, questionText);
      }
      setAiLoadingQuestionId(null);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      action();
    }
  };

  // Check if a question already has an AI answer
  const hasAIAnswer = (q: QAItem) => q.answers.some(a => a.isAI);

  // Styles
  const headerStyle: React.CSSProperties = {
    padding: '24px 28px 0',
    borderBottom: 'none',
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: 1.3,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: '0 0 20px 0',
    lineHeight: 1.4,
  };

  const askSectionStyle: React.CSSProperties = {
    padding: '0 28px 20px',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '72px',
    padding: '12px 16px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  };

  const askBtnRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  };

  const askBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: newQuestion.trim() ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-5, #B1B5C3)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
    cursor: newQuestion.trim() ? 'pointer' : 'not-allowed',
    transition: 'all 150ms ease',
  };

  const askAIBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: newQuestion.trim() ? 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)' : 'var(--color-neutrals-5, #B1B5C3)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
    cursor: newQuestion.trim() ? 'pointer' : 'not-allowed',
    transition: 'all 150ms ease',
  };

  const hintStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    color: 'var(--color-neutrals-5, #B1B5C3)',
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    padding: '16px 28px 0',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const getTabStyle = (tab: string): React.CSSProperties => ({
    padding: '10px 16px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-4, #6E7481)',
    background: hoveredTab === tab ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--color-neutrals-1, #141416)' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    borderRadius: '4px 4px 0 0',
  });

  const questionsListStyle: React.CSSProperties = {
    padding: '0 28px 28px',
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const questionCardStyle: React.CSSProperties = {
    padding: '20px 0',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const questionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  };

  const upvoteBtnStyle = (id: string, count: number): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '6px 8px',
    background: hoveredUpvote === id ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    minWidth: '40px',
    color: count > 0 ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-4, #6E7481)',
    flexShrink: 0,
  });

  const questionTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 6px 0',
  };

  const questionMetaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const editorBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    background: 'var(--color-primary-1, #E90C17)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const aiBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const editorPickBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    background: '#33C4FF',
    color: 'white',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const answersSectionStyle: React.CSSProperties = {
    marginTop: '12px',
    marginLeft: '52px',
    padding: '12px 0 0',
    borderTop: '1px solid var(--color-neutrals-7, #F4F5F6)',
  };

  const answerCardStyle = (isAI?: boolean): React.CSSProperties => ({
    padding: '12px',
    display: 'flex',
    gap: '10px',
    borderRadius: isAI ? 'var(--border-radius-md, 8px)' : undefined,
    background: isAI ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.08))' : undefined,
    border: isAI ? '1px solid rgba(139, 92, 246, 0.15)' : undefined,
    marginBottom: isAI ? '8px' : undefined,
  });

  const aiAvatarStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'white',
  };

  const answerAvatarStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-neutrals-3, #353945)',
  };

  const answerTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: '0 0 4px 0',
  };

  const answerInputRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    alignItems: 'flex-end',
  };

  const answerInputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 14px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    outline: 'none',
    resize: 'none',
    minHeight: '40px',
    boxSizing: 'border-box' as const,
  };

  const sendBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: answerText.trim() ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-5, #B1B5C3)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    cursor: answerText.trim() ? 'pointer' : 'not-allowed',
    color: 'white',
    flexShrink: 0,
    transition: 'all 150ms ease',
  };

  const answersToggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-neutrals-3, #353945)',
    cursor: 'pointer',
    marginTop: '8px',
  };

  const emptyStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--color-neutrals-4, #6E7481)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
  };

  const countBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '22px',
    height: '22px',
    padding: '0 6px',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-neutrals-2, #23262F)',
  };

  const getAskAIQuestionBtnStyle = (qId: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: hoveredAiBtn === qId ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15))',
    color: hoveredAiBtn === qId ? 'white' : '#6366F1',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    marginLeft: '8px',
  });

  const aiLoadingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: 'var(--border-radius-md, 8px)',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.08))',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    marginBottom: '8px',
  };

  const aiDisclaimerStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginTop: '6px',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      width="640px"
    >
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <h2 style={titleStyle}>
            <Icon name="forum" size={24} />
            Q&A
            <span style={countBadgeStyle}>{questions.length}</span>
          </h2>
        </div>
        <p style={subtitleStyle}>
          Ask questions about <strong>{vehicleName || articleTitle}</strong> and get answers from editors, the community, or <span style={{ color: '#6366F1', fontWeight: 600 }}>AI</span>.
        </p>
      </div>

      {/* Ask a Question */}
      <div style={askSectionStyle}>
        <textarea
          ref={questionInputRef}
          style={textareaStyle}
          placeholder="Ask a question about this vehicle or article..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, () => handleSubmitQuestion(false))}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-neutrals-3, #353945)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-neutrals-6, #E6E8EC)';
          }}
        />
        <div style={askBtnRowStyle}>
          <span style={hintStyle}>Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to submit</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={askAIBtnStyle}
              onClick={() => handleSubmitQuestion(true)}
              disabled={!newQuestion.trim() || isSubmitting}
              title="Post your question and get an instant AI answer"
            >
              <Icon name="auto_awesome" size={16} />
              {isSubmitting && askAIWithQuestion ? 'Posting...' : 'Ask AI'}
            </button>
            <button
              style={askBtnStyle}
              onClick={() => handleSubmitQuestion(false)}
              disabled={!newQuestion.trim() || isSubmitting}
            >
              {isSubmitting && !askAIWithQuestion ? 'Posting...' : 'Ask Community'}
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={tabsStyle}>
        {(['popular', 'recent', 'unanswered'] as const).map((tab) => (
          <button
            key={tab}
            style={getTabStyle(tab)}
            onClick={() => setActiveTab(tab)}
            onMouseEnter={() => setHoveredTab(tab)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {tab === 'popular' ? 'Most Popular' : tab === 'recent' ? 'Recent' : 'Unanswered'}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div style={questionsListStyle}>
        {sortedQuestions.length === 0 ? (
          <div style={emptyStyle}>
            <Icon name="help_outline" size={40} style={{ color: 'var(--color-neutrals-5, #B1B5C3)', marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--color-neutrals-2, #23262F)' }}>No questions yet</p>
            <p style={{ margin: 0 }}>Be the first to ask about this {vehicleName ? 'vehicle' : 'article'}!</p>
          </div>
        ) : (
          sortedQuestions.map((q) => (
            <div key={q.id} style={questionCardStyle}>
              <div style={questionHeaderStyle}>
                {/* Upvote */}
                <button
                  style={upvoteBtnStyle(q.id, q.upvotes)}
                  onClick={() => onUpvoteQuestion(q.id)}
                  onMouseEnter={() => setHoveredUpvote(q.id)}
                  onMouseLeave={() => setHoveredUpvote(null)}
                >
                  <Icon name="arrow_upward" size={14} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{q.upvotes}</span>
                </button>

                {/* Question Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    {q.isEditorPick && (
                      <span style={editorPickBadgeStyle}>
                        <Icon name="auto_awesome" size={10} />
                        Editor's Pick
                      </span>
                    )}
                  </div>
                  <p style={questionTextStyle}>{q.question}</p>
                  <div style={questionMetaStyle}>
                    <span style={{ fontWeight: 500 }}>{q.author}</span>
                    <span>·</span>
                    <span>{q.date}</span>
                    <span>·</span>
                    <span>{q.answers.length} {q.answers.length === 1 ? 'answer' : 'answers'}</span>
                    {/* Ask AI button inline */}
                    {onAskAI && !hasAIAnswer(q) && aiLoadingQuestionId !== q.id && (
                      <button
                        style={getAskAIQuestionBtnStyle(q.id)}
                        onClick={() => handleAskAI(q.id, q.question)}
                        onMouseEnter={() => setHoveredAiBtn(q.id)}
                        onMouseLeave={() => setHoveredAiBtn(null)}
                      >
                        <Icon name="auto_awesome" size={12} />
                        Get AI Answer
                      </button>
                    )}
                    {hasAIAnswer(q) && (
                      <span style={{ ...aiBadgeStyle, fontSize: '9px', padding: '1px 6px' }}>
                        <Icon name="auto_awesome" size={9} />
                        AI Answered
                      </span>
                    )}
                  </div>

                  {/* Answers Toggle */}
                  {q.answers.length > 0 && (
                    <button
                      style={answersToggleStyle}
                      onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                    >
                      <Icon name={expandedQuestion === q.id ? 'expand_less' : 'expand_more'} size={18} />
                      {expandedQuestion === q.id ? 'Hide answers' : `View ${q.answers.length} ${q.answers.length === 1 ? 'answer' : 'answers'}`}
                    </button>
                  )}

                  {/* Answers Section */}
                  {(expandedQuestion === q.id || q.answers.length === 0) && (
                    <div style={answersSectionStyle}>
                      {/* AI Loading State */}
                      {aiLoadingQuestionId === q.id && (
                        <div style={aiLoadingStyle}>
                          <div style={aiAvatarStyle}>
                            <Icon name="auto_awesome" size={14} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#6366F1' }}>MotorTrend AI</span>
                              <span style={aiBadgeStyle}>
                                <Icon name="auto_awesome" size={10} />
                                AI
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                display: 'flex',
                                gap: '4px',
                              }}>
                                {[0, 1, 2].map((i) => (
                                  <div
                                    key={i}
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      backgroundColor: '#8B5CF6',
                                      animation: `qaModalPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                  />
                                ))}
                              </div>
                              <span style={{ fontSize: '13px', color: 'var(--color-neutrals-4, #6E7481)' }}>
                                Analyzing article and generating answer...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {q.answers.map((answer) => (
                        <div key={answer.id} style={answerCardStyle(answer.isAI)}>
                          {answer.isAI ? (
                            <div style={aiAvatarStyle}>
                              <Icon name="auto_awesome" size={14} />
                            </div>
                          ) : (
                            <div style={answerAvatarStyle}>
                              {answer.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ 
                                fontSize: '13px', 
                                fontWeight: 600, 
                                color: answer.isAI ? '#6366F1' : 'var(--color-neutrals-1, #141416)' 
                              }}>
                                {answer.author}
                              </span>
                              {answer.isAI && (
                                <span style={aiBadgeStyle}>
                                  <Icon name="auto_awesome" size={10} />
                                  AI
                                </span>
                              )}
                              {answer.isEditor && (
                                <span style={editorBadgeStyle}>
                                  <Icon name="verified" size={10} />
                                  Editor
                                </span>
                              )}
                              <span style={{ fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)' }}>{answer.date}</span>
                            </div>
                            <p style={answerTextStyle}>{answer.text}</p>
                            {answer.isAI && (
                              <div style={aiDisclaimerStyle}>
                                <Icon name="info" size={12} />
                                AI-generated based on article content. May not be fully accurate.
                              </div>
                            )}
                            <button
                              style={{ 
                                ...upvoteBtnStyle(`answer-${answer.id}`, answer.upvotes),
                                flexDirection: 'row',
                                padding: '4px 8px',
                                gap: '4px',
                                minWidth: 'auto',
                                marginTop: '4px',
                              }}
                              onClick={() => onUpvoteAnswer(q.id, answer.id)}
                              onMouseEnter={() => setHoveredUpvote(`answer-${answer.id}`)}
                              onMouseLeave={() => setHoveredUpvote(null)}
                            >
                              <Icon name="thumb_up" size={12} />
                              <span style={{ fontSize: '11px', fontWeight: 600 }}>{answer.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Answer Input */}
                      <div style={answerInputRowStyle}>
                        <textarea
                          style={answerInputStyle}
                          placeholder="Write an answer..."
                          value={expandedQuestion === q.id ? answerText : ''}
                          onChange={(e) => setAnswerText(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, () => handleSubmitAnswer(q.id))}
                          rows={1}
                        />
                        <button
                          style={sendBtnStyle}
                          onClick={() => handleSubmitAnswer(q.id)}
                          disabled={!answerText.trim()}
                        >
                          <Icon name="send" size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline keyframes for AI loading animation */}
      <style>{`
        @keyframes qaModalPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </ModalShell>
  );
};

export default QAModal;
