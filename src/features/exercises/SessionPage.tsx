import { useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, LinearProgress, Box, Alert } from '@mui/material';

import { useAppDispatch } from '../../store';
import { useFinishSession } from '../../api/exercises';
import type { SessionWord } from '../../api/exercises';
import { fetchMe } from '../../api/auth';
import { JedninaMnozinaExercise } from './JedninaMnozinaExercise';
import { FlashcardExercise } from './FlashcardExercise';

interface SessionLocationState {
  words: SessionWord[];
  exerciseType: string;
  totalQuestions: number;
}

interface SessionAnswer {
  wordId: string;
  givenAnswer: string;
  isCorrect: boolean;
}

export function SessionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const state = location.state as SessionLocationState | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const finishSession = useFinishSession();

  const handleAnswer = useCallback(
    async (answer: SessionAnswer) => {
      const updatedAnswers = [...answers, answer];
      setAnswers(updatedAnswers);

      if (!state) return;

      if (currentIndex + 1 >= state.words.length) {
        try {
          const result = await finishSession.mutateAsync({
            sessionId: sessionId!,
            answers: updatedAnswers,
          });
          dispatch(fetchMe());
          navigate(`/exercises/results/${sessionId}`, {
            state: {
              correctAnswers: result.correctAnswers,
              totalQuestions: result.totalQuestions,
              xpEarned: result.xpEarned,
              currentStreak: result.currentStreak,
            },
            replace: true,
          });
        } catch {
          // Error handled by mutation state
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [answers, currentIndex, state, sessionId, finishSession, dispatch, navigate],
  );

  if (!state || !state.words || state.words.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{t('common.error')}</Alert>
      </Container>
    );
  }

  const { words, exerciseType } = state;
  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t('exercises.session.progress', {
          current: currentIndex + 1,
          total: words.length,
        })}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      {finishSession.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('common.error')}
        </Alert>
      )}

      <Box>
        {exerciseType === 'JEDNINA_MNOZINA' && (
          <JedninaMnozinaExercise
            key={currentWord.wordId}
            word={currentWord}
            onAnswer={handleAnswer}
            isLast={currentIndex + 1 >= words.length}
          />
        )}
        {exerciseType === 'FLASHCARDS' && (
          <FlashcardExercise
            key={currentWord.wordId}
            word={currentWord}
            onAnswer={handleAnswer}
            isLast={currentIndex + 1 >= words.length}
          />
        )}
      </Box>
    </Container>
  );
}
