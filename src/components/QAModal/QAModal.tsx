/**
 * Q&A Modal Component
 * Modal for asking questions, viewing answers, and browsing common Q&A on article pages
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
}) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'unanswered'>('popular');
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredUpvote, setHoveredUpvote] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

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

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;
    setIsSubmitting(true);
    onSubmitQuestion(newQuestion.trim());
    setNewQuestion('');
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!answerText.trim()) return;
    onSubmitAnswer(questionId, answerText.trim());
    setAnswerText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      action();
    }
  };

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

  const answerCardStyle: React.CSSProperties = {
    padding: '12px 0',
    display: 'flex',
    gap: '10px',
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
          Ask questions about <strong>{vehicleName || articleTitle}</strong> and get answers from editors and the community.
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
          onKeyDown={(e) => handleKeyDown(e, handleSubmitQuestion)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-neutrals-3, #353945)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-neutrals-6, #E6E8EC)';
          }}
        />
        <div style={askBtnRowStyle}>
          <span style={hintStyle}>Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to submit</span>
          <button
            style={askBtnStyle}
            onClick={handleSubmitQuestion}
            disabled={!newQuestion.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Ask Question'}
            <Icon name="send" size={16} />
          </button>
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
                      {q.answers.map((answer) => (
                        <div key={answer.id} style={answerCardStyle}>
                          <div style={answerAvatarStyle}>
                            {answer.author.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutrals-1, #141416)' }}>{answer.author}</span>
                              {answer.isEditor && (
                                <span style={editorBadgeStyle}>
                                  <Icon name="verified" size={10} />
                                  Editor
                                </span>
                              )}
                              <span style={{ fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)' }}>{answer.date}</span>
                            </div>
                            <p style={answerTextStyle}>{answer.text}</p>
                            <button
                              style={{ 
                                ...upvoteBtnStyle(`answer-${answer.id}`, answer.upvotes),
                                flexDirection: 'row',
                                padding: '4px 8px',
                                gap: '4px',
                                minWidth: 'auto',
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
    </ModalShell>
  );
};

export default QAModal;
