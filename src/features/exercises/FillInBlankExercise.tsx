import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TextField, Button, Card, CardContent, Box, Alert } from '@mui/material';
import type { FillInBlankItem } from '@cro/shared';

import { normalizeAnswer } from '../../shared/lib/content-utils';

interface FillInBlankExerciseProps {
  item: FillInBlankItem;
  onAnswer: (answer: { itemId: string; givenAnswer: string; isCorrect: boolean }) => void;
  isLast: boolean;
}

function renderSentence(sentenceHr: string): string {
  return sentenceHr.replace('{{BLANK}}', '______');
}

export function FillInBlankExercise({ item, onAnswer, isLast }: FillInBlankExerciseProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const correct = normalizeAnswer(input) === normalizeAnswer(item.blankAnswer);
    setIsCorrect(correct);
    setChecked(true);
  };

  const handleNext = () => {
    onAnswer({
      itemId: item.id,
      givenAnswer: input,
      isCorrect,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      if (!checked) {
        if (input.trim()) handleCheck();
      } else {
        handleNext();
      }
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('exercises.fillInBlank.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('exercises.fillInBlank.instruction')}
        </Typography>

        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          {renderSentence(item.sentenceHr)}
        </Typography>

        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('exercises.fillInBlank.placeholder')}
          disabled={checked}
          autoFocus
          sx={{ mb: 2 }}
        />

        {checked && (
          <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
            {isCorrect
              ? t('exercises.fillInBlank.correct')
              : t('exercises.fillInBlank.incorrect', { answer: item.blankAnswer })}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!checked ? (
            <Button variant="contained" onClick={handleCheck} disabled={!input.trim()}>
              {t('exercises.session.check')}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              {isLast ? t('exercises.session.finish') : t('exercises.session.next')}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
