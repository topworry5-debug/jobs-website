import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Award, 
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function QuizSimulator({ module, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(module.timeLimitMinutes * 60);

  const currentQ = module.questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleSelectOption = (optionIndex) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // Answered already
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex
    });
    setShowExplanation({
      ...showExplanation,
      [currentQ.id]: true
    });
  };

  // Calculate score
  let correctCount = 0;
  let wrongCount = 0;
  module.questions.forEach((q) => {
    const ans = selectedAnswers[q.id];
    if (ans !== undefined) {
      if (ans === q.correctIndex) correctCount++;
      else wrongCount++;
    }
  });

  const rawMarks = (correctCount * (module.totalMarks / module.questions.length)) - (wrongCount * module.negativeMarking);
  const finalScore = Math.max(0, Math.round(rawMarks * 10) / 10);
  const percentage = Math.round((correctCount / module.questions.length) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="quiz-simulator-container">
      {/* Top Header Controls */}
      <div className="quiz-header-bar card">
        <div className="quiz-info-left">
          <button className="btn btn-sm btn-outline back-btn" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>All Past Papers</span>
          </button>
          <div>
            <h3 className="quiz-title">{module.title}</h3>
            <span className="quiz-sub">{module.agency} • {module.subject}</span>
          </div>
        </div>

        <div className="quiz-status-right">
          <div className={`timer-badge ${secondsRemaining < 60 ? 'timer-urgent' : ''}`}>
            <Clock size={16} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <div className="progress-badge">
            <span>{Object.keys(selectedAnswers).length} / {module.questions.length} Solved</span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="quiz-active-workspace">
          {/* Question Card */}
          <div className="question-card card">
            <div className="question-top-row">
              <span className="question-number-pill">Question {currentIdx + 1} of {module.questions.length}</span>
              {module.negativeMarking > 0 && (
                <span className="negative-marking-tag">Negative marking: -{module.negativeMarking}</span>
              )}
            </div>

            <h4 className="question-text">{currentQ.question}</h4>

            {/* Options List */}
            <div className="options-list">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const isAnswered = selectedAnswers[currentQ.id] !== undefined;
                const isCorrect = idx === currentQ.correctIndex;

                let optClass = 'option-btn';
                if (isAnswered) {
                  if (isCorrect) optClass += ' correct';
                  else if (isSelected) optClass += ' wrong';
                } else if (isSelected) {
                  optClass += ' selected';
                }

                return (
                  <button
                    key={idx}
                    className={optClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-text">{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-red" />}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Box */}
            {showExplanation[currentQ.id] && (
              <div className="explanation-box">
                <div className="explanation-header">
                  <Sparkles size={15} className="text-emerald" />
                  <span>Verified Explanation & Concept:</span>
                </div>
                <p className="explanation-text">{currentQ.explanation}</p>
              </div>
            )}

            {/* Nav Row */}
            <div className="question-nav-row">
              <button
                className="btn btn-outline"
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
              >
                <ArrowLeft size={15} />
                <span>Previous</span>
              </button>

              {currentIdx < module.questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                >
                  <span>Next Question</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  className="btn btn-accent"
                  onClick={() => setIsCompleted(true)}
                >
                  <CheckCircle2 size={16} />
                  <span>Submit & View Results</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results & Score Summary */
        <div className="quiz-results-card card">
          <div className="result-celebration-badge">
            <Award size={36} className="text-emerald" />
          </div>

          <h2 className="results-title">Mock Examination Completed</h2>
          <p className="results-sub">Performance report based on official {module.agency} testing criteria</p>

          <div className="score-summary-grid">
            <div className="score-box">
              <span className="score-lbl">Obtained Marks</span>
              <span className="score-val text-emerald">{finalScore} / {module.totalMarks}</span>
            </div>

            <div className="score-box">
              <span className="score-lbl">Accuracy Rate</span>
              <span className="score-val text-blue">{percentage}%</span>
            </div>

            <div className="score-box">
              <span className="score-lbl">Correct Answers</span>
              <span className="score-val">{correctCount} Questions</span>
            </div>

            <div className="score-box">
              <span className="score-lbl">Incorrect / Penalty</span>
              <span className="score-val text-red">{wrongCount} (-{wrongCount * module.negativeMarking})</span>
            </div>
          </div>

          <div className="result-actions-row">
            <button className="btn btn-outline" onClick={onBack}>
              <BookOpen size={15} />
              <span>Back to Test Modules</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedAnswers({});
                setShowExplanation({});
                setIsCompleted(false);
                setCurrentIdx(0);
                setSecondsRemaining(module.timeLimitMinutes * 60);
              }}
            >
              <RotateCcw size={15} />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
