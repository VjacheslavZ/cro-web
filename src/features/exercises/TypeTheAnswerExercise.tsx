import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TextField, Button, Card, CardContent, Box, Alert } from '@mui/material';
import type { SingularPluralItem } from '@cro/shared';

import { normalizeAnswer } from '../../shared/lib/content-utils';
import { useAppSelector } from '../../store';

function getTranslation(item: SingularPluralItem, lang: string | null): string {
  switch (lang) {
    case 'RU':
      return item.translationRu;
    case 'UK':
      return item.translationUk;
    default:
      return item.translationEn;
  }
}

const CORRECT_DELAY = Number(import.meta.env.VITE_CORRECT_DELAY_MS) || 1000;
const INCORRECT_DELAY = Number(import.meta.env.VITE_INCORRECT_DELAY_MS) || 2000;

interface TypeTheAnswerExerciseProps {
  item: SingularPluralItem;
  onAnswer: (answer: { itemId: string; givenAnswer: string; isCorrect: boolean }) => void;
  isLast: boolean;
}

export function TypeTheAnswerExercise({ item, onAnswer }: TypeTheAnswerExerciseProps) {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCheck = () => {
    const correct = normalizeAnswer(input) === normalizeAnswer(item.pluralForm);
    setIsCorrect(correct);
    setChecked(true);
    timerRef.current = setTimeout(
      () => {
        onAnswer({ itemId: item.id, givenAnswer: input, isCorrect: correct });
      },
      correct ? CORRECT_DELAY : INCORRECT_DELAY,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !checked && input.trim()) {
      handleCheck();
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('exercises.typeTheAnswer.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('exercises.typeTheAnswer.instruction')}
        </Typography>

        <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
          {item.baseForm}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {getTranslation(item, user?.nativeLanguage ?? null)}
        </Typography>

        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('exercises.typeTheAnswer.placeholder')}
          disabled={checked}
          autoFocus
          sx={{ mb: 2 }}
        />

        {checked && (
          <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
            {isCorrect
              ? t('exercises.typeTheAnswer.correct')
              : t('exercises.typeTheAnswer.incorrect', { answer: item.pluralForm })}
          </Alert>
        )}

        {!checked && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleCheck} disabled={!input.trim()}>
              {t('exercises.session.check')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
