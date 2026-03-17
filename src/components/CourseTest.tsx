import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { IS_STATIC_EXPORT } from '@/lib/deployTarget';

interface Question {
  question: string;
  options: string[];
  correct_index: number;
}

interface TestData {
  id: string;
  course_id: string;
  questions: Question[];
  release_answers_at: string;
  isReleased: boolean;
  timeUntilRelease: number;
}

interface CourseTestProps {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
}

export default function CourseTest({ courseId, courseTitle, onClose }: CourseTestProps) {
  if (IS_STATIC_EXPORT) {
    return (
      <div className="course-test-overlay">
        <div className="test-modal glass neon-border">
          <header className="test-header">
            <div className="header-info">
              <span className="test-badge">EVALUACION</span>
              <h1>{courseTitle}</h1>
              <p>La evaluacion no esta disponible en la version estatica (FTP).</p>
            </div>
            <button className="close-test" onClick={onClose}>X</button>
          </header>
          <footer className="test-footer">
            <button className="finish-btn" onClick={onClose}>CERRAR</button>
          </footer>
        </div>

        <style jsx>{`
          .course-test-overlay { position: fixed; inset: 0; background: var(--overlay-backdrop); backdrop-filter: blur(30px); z-index: 3000; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
          .test-modal { width: 100%; max-width: 800px; height: fit-content; background: var(--modal-surface); color: var(--modal-text); border-radius: 40px; padding: 40px; position: relative; margin-bottom: 40px; border: 1px solid var(--modal-border); }
          .close-test { position: absolute; top: 20px; right: 20px; background: none; border: none; color: inherit; opacity: 0.5; font-size: 1.5rem; cursor: pointer; }
          .test-header { border-bottom: 1px solid var(--modal-border); padding-bottom: 30px; margin-bottom: 40px; }
          .test-badge { font-size: 0.7rem; font-weight: 900; background: var(--primary); color: black; padding: 4px 12px; border-radius: 6px; letter-spacing: 2px; }
          .test-header h1 { font-size: 2.2rem; margin: 15px 0 5px; font-weight: 900; }
          .test-header p { opacity: 0.7; font-size: 0.95rem; }
          .test-footer { margin-top: 10px; padding-top: 20px; border-top: 1px solid var(--modal-border); text-align: center; }
          .finish-btn { padding: 15px 40px; background: var(--foreground); color: var(--background); font-weight: 900; border: none; border-radius: 12px; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchTest();
  }, [courseId]);

  const fetchTest = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/test`);
      if (res.ok) {
        setTest(await res.json());
      }
    } catch (err) {
      console.error('Error fetching test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: oIdx });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < 20) {
      alert('Por favor responde las 20 preguntas antes de finalizar.');
      return;
    }
    let correctCount = 0;
    test?.questions.forEach((q, i) => {
      if (answers[i] === q.correct_index) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  if (loading) return <div className="test-loading">Cargando evaluación...</div>;
  if (!test) return <div className="test-error">No se encontró evaluación para este curso.</div>;

  return (
    <div className="course-test-overlay">
      <div className="test-modal glass neon-border">
        <header className="test-header">
          <div className="header-info">
            <span className="test-badge">EVALUACIÓN CULINARIA</span>
            <h1>{courseTitle}</h1>
            <p>Responde las 20 cuestiones técnicas basadas en la lección.</p>
          </div>
          <button className="close-test" onClick={onClose}>X</button>
        </header>

        <div className="test-body">
          {!test.isReleased && (
            <div className="unlock-alert">
              <Clock size={16} />
              <span>Las respuestas correctas y tu calificación final se revelarán en {Math.ceil(test.timeUntilRelease / (1000 * 60 * 60))} horas (96h cooldown).</span>
            </div>
          )}

          <div className="questions-list">
            {test.questions.map((q, qIdx) => (
              <div key={qIdx} className="question-item">
                <p className="q-text">{qIdx + 1}. {q.question}</p>
                <div className="options-grid">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === oIdx;
                    const isCorrect = q.correct_index !== undefined && q.correct_index === oIdx;
                    return (
                      <button
                        key={oIdx}
                        className={`option-btn ${isSelected ? 'selected' : ''} ${submitted && test.isReleased && isCorrect ? 'correct' : ''} ${submitted && test.isReleased && isSelected && !isCorrect ? 'wrong' : ''}`}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        disabled={submitted}
                      >
                        <span className="opt-marker">{String.fromCharCode(65 + oIdx)}</span>
                        {opt}
                        {submitted && test.isReleased && isCorrect && <CheckCircle2 size={16} className="ml-auto text-success" />}
                        {submitted && test.isReleased && isSelected && !isCorrect && <XCircle size={16} className="ml-auto text-error" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="test-footer">
          {!submitted ? (
            <button className="submit-test-btn" onClick={handleSubmit}>
              FINALIZAR Y REGISTRAR EVALUACIÓN
            </button>
          ) : (
            <div className="results-summary">
              {test.isReleased ? (
                <div className="score-reveal">
                  <h2>Resultado: {score}/20</h2>
                  <p>{score >= 18 ? '¡Maestro Gastronómico!' : score >= 14 ? 'Nivel Profesional' : 'Sigue practicando'}</p>
                  <button className="finish-btn" onClick={onClose}>CERRAR</button>
                </div>
              ) : (
                <div className="pending-reveal">
                  <AlertCircle size={32} className="mb-10 text-primary" />
                  <h2>Evaluación Registrada</h2>
                  <p>Tu hoja de respuestas ha sido enviada. Regresa en 96 horas para ver tu nota y las correcciones.</p>
                  <button className="finish-btn" onClick={onClose}>ENTENDIDO</button>
                </div>
              )}
            </div>
          )}
        </footer>
      </div>

      <style jsx>{`
        .course-test-overlay { position: fixed; inset: 0; background: var(--overlay-backdrop); backdrop-filter: blur(30px); z-index: 3000; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
        .test-modal { width: 100%; max-width: 800px; height: fit-content; background: var(--modal-surface); color: var(--modal-text); border-radius: 40px; padding: 40px; position: relative; margin-bottom: 40px; border: 1px solid var(--modal-border); }
        .close-test { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--modal-text); opacity: 0.4; font-size: 1.5rem; cursor: pointer; }
        .close-test:hover { opacity: 1; }

        .test-header { border-bottom: 1px solid var(--modal-border); padding-bottom: 30px; margin-bottom: 40px; }
        .test-badge { font-size: 0.7rem; font-weight: 900; background: var(--primary); color: black; padding: 4px 12px; border-radius: 6px; letter-spacing: 2px; }
        .test-header h1 { font-size: 2.2rem; margin: 15px 0 5px; font-weight: 900; }
        .test-header p { opacity: 0.7; font-size: 0.95rem; color: var(--modal-muted); }

        .unlock-alert { display: flex; align-items: center; gap: 10px; background: rgba(var(--primary-rgb), 0.1); border: 1px solid var(--primary); color: var(--primary); padding: 12px 20px; border-radius: 12px; font-size: 0.85rem; margin-bottom: 30px; font-weight: 700; }

        .questions-list { display: flex; flex-direction: column; gap: 50px; }
        .question-item .q-text { font-size: 1.2rem; font-weight: 800; color: var(--modal-text); margin-bottom: 20px; line-height: 1.4; }
        .options-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .option-btn {
          display: flex; align-items: center; gap: 15px; padding: 15px 20px; border: 1px solid rgba(255,255,255,0.05);
          background: var(--modal-surface-2); text-align: left; color: var(--modal-text); font-size: 0.95rem; cursor: pointer; transition: 0.3s;
          border-radius: 12px; line-height: 1.4;
        }
        .option-btn { border-color: var(--modal-border); }
        .option-btn:hover:not(:disabled) { background: rgba(var(--primary-rgb), 0.08); border-color: var(--primary); }
        .option-btn.selected { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }
        .opt-marker { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; flex-shrink: 0; color: var(--modal-text); }
        .selected .opt-marker { background: var(--primary); color: black; }

        .option-btn.correct { border-color: #00ff88; background: rgba(0,255,136,0.1); }
        .option-btn.wrong { border-color: #ff0055; background: rgba(255,0,85,0.1); }
        .text-success { color: #00ff88; }
        .text-error { color: #ff0055; }

        .test-footer { margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--modal-border); text-align: center; }
        .submit-test-btn { padding: 20px 40px; background: var(--primary); color: black; font-weight: 900; border: none; border-radius: 15px; cursor: pointer; font-size: 1.1rem; transition: 0.3s; }
        .submit-test-btn:hover { transform: scale(1.05); box-shadow: var(--neon-shadow); }
        
        .results-summary h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 10px; }
        .results-summary p { opacity: 0.6; margin-bottom: 30px; }
        .finish-btn { padding: 15px 40px; background: white; color: black; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; }
        
        .test-loading, .test-error { color: var(--foreground); text-align: center; padding: 100px; font-size: 1.2rem; }
      `}</style>
    </div>
  );
}
