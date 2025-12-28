'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { Quiz, QuizQuestion, QuizAttempt } from '@/lib/course-types'

interface QuizPlayerProps {
  quizId: string
  moduleId: string
  enrollmentId: string
  userId: string
  onComplete?: (passed: boolean, score: number) => void
}

export default function QuizPlayer({
  quizId,
  moduleId,
  enrollmentId,
  userId,
  onComplete,
}: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeStarted, setTimeStarted] = useState<number>(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  // Results state
  const [showResults, setShowResults] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    if (isOpen && timeStarted > 0) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - timeStarted) / 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isOpen, timeStarted])

  const loadQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/student/quiz?quizId=${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data.quiz)
        setPreviousAttempts(data.attempts || [])
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    setIsOpen(true)
    setTimeStarted(Date.now())
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setAttempt(null)
    loadQuiz()
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    })
  }

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return

    // Check if all required questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (q) => !answers[q.id] && answers[q.id] !== false
    )

    if (unansweredQuestions.length > 0) {
      alert(`Bitte beantworten Sie alle Fragen (${unansweredQuestions.length} verbleibend)`)
      return
    }

    setSubmitting(true)

    try {
      // Calculate answers with correct/incorrect
      const questionAnswers = quiz.questions.map((question) => {
        const userAnswer = answers[question.id]
        let correct = false
        
        if (question.type === 'multiple_choice') {
          correct = userAnswer === question.correctAnswer
        } else if (question.type === 'true_false') {
          correct = userAnswer === question.correctBoolean
        } else if (question.type === 'short_answer') {
          // Simple string comparison (case-insensitive)
          correct = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toString().toLowerCase().trim()
        }

        return {
          questionId: question.id,
          answer: userAnswer,
          correct,
          points: correct ? question.points : 0,
        }
      })

      const response = await fetch('/api/student/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          userId,
          enrollmentId,
          answers: questionAnswers,
          timeSpent: timeElapsed,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAttempt(data.attempt)
        setShowResults(true)

        if (onComplete) {
          onComplete(data.attempt.passed, data.attempt.score)
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetakeQuiz = () => {
    setShowResults(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeStarted(Date.now())
    setTimeElapsed(0)
    setAttempt(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Laden...
      </Button>
    )
  }

  if (!quiz && !loading) {
    return (
      <Button size="sm" variant="outline" onClick={loadQuiz}>
        Quiz starten
      </Button>
    )
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0
  const canRetake = quiz && previousAttempts.length < quiz.attemptsAllowed

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleStartQuiz}>
        <Award className="h-4 w-4 mr-2" />
        Quiz starten
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{quiz?.title}</span>
              {!showResults && (
                <div className="flex items-center gap-2 text-sm font-normal">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                  {quiz?.timeLimit && (
                    <span className="text-gray-500">/ {quiz.timeLimit} min</span>
                  )}
                </div>
              )}
            </DialogTitle>
            <DialogDescription>{quiz?.description}</DialogDescription>
          </DialogHeader>

          {!showResults ? (
            /* Quiz Questions */
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    Frage {currentQuestionIndex + 1} von {quiz?.questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {/* Current Question */}
              {currentQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline">{currentQuestion.type}</Badge>
                      <span>{currentQuestion.points} Punkte</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Multiple Choice */}
                    {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                      <RadioGroup
                        value={answers[currentQuestion.id]?.toString()}
                        onValueChange={(value) =>
                          handleAnswerChange(currentQuestion.id, parseInt(value))
                        }
                      >
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {/* True/False */}
                    {currentQuestion.type === 'true_false' && (
                      <RadioGroup
                        value={answers[currentQuestion.id]?.toString()}
                        onValueChange={(value) =>
                          handleAnswerChange(currentQuestion.id, value === 'true')
                        }
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true" className="flex-1 cursor-pointer">
                            Wahr
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false" className="flex-1 cursor-pointer">
                            Falsch
                          </Label>
                        </div>
                      </RadioGroup>
                    )}

                    {/* Short Answer */}
                    {currentQuestion.type === 'short_answer' && (
                      <Input
                        placeholder="Ihre Antwort..."
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Zurück
                </Button>

                <div className="flex gap-2">
                  {currentQuestionIndex === (quiz?.questions.length || 0) - 1 ? (
                    <Button onClick={handleSubmitQuiz} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Einreichen...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Einreichen
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>Weiter</Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Results */
            <div className="space-y-6">
              {/* Score Summary */}
              <Card className={attempt?.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    {attempt?.passed ? (
                      <>
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                          Bestanden!
                        </h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-900 mb-2">
                          Nicht bestanden
                        </h3>
                      </>
                    )}
                    <p className="text-lg mb-4">
                      Punktzahl: {attempt?.score} / {attempt?.maxScore} (
                      {attempt ? Math.round((attempt.score / attempt.maxScore) * 100) : 0}%)
                    </p>
                    <p className="text-sm text-gray-600">
                      Bestehensgrenze: {quiz?.passingScore}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Zeit: {formatTime(attempt?.timeSpent || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              {quiz?.showResults && attempt && (
                <div className="space-y-4">
                  <h4 className="font-bold">Detaillierte Ergebnisse:</h4>
                  {quiz.questions.map((question, index) => {
                    const answer = attempt.answers.find((a) => a.questionId === question.id)
                    
                    return (
                      <Card key={question.id} className={answer?.correct ? 'border-green-200' : 'border-red-200'}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">
                                {index + 1}. {question.question}
                              </p>
                            </div>
                            {answer?.correct ? (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Ihre Antwort: </span>
                              {question.type === 'multiple_choice' && question.options
                                ? question.options[answer?.answer as number]
                                : answer?.answer?.toString()}
                            </p>
                            {!answer?.correct && (
                              <p className="text-green-700">
                                <span className="font-medium">Richtige Antwort: </span>
                                {question.type === 'multiple_choice' && question.options
                                  ? question.options[question.correctAnswer as number]
                                  : question.correctAnswer?.toString()}
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-gray-600">
                                <span className="font-medium">Erklärung: </span>
                                {question.explanation}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Punkte: </span>
                              {answer?.points} / {question.points}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Attempt Info */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p>
                    Versuch {attempt?.attemptNumber} von {quiz?.attemptsAllowed}
                  </p>
                  {!attempt?.passed && canRetake && (
                    <p className="text-blue-700">Sie können das Quiz erneut versuchen</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Schließen
                </Button>
                {!attempt?.passed && canRetake && (
                  <Button onClick={handleRetakeQuiz}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Erneut versuchen
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
