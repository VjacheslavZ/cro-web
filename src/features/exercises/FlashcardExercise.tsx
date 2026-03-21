import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Card, CardActionArea, Box } from '@mui/material';

import { useAppSelector } from '../../store';
import type { SessionWord } from '../../api/exercises';

interface FlashcardExerciseProps {
  word: SessionWord;
  onAnswer: (answer: { wordId: string; givenAnswer: string; isCorrect: boolean }) => void;
  isLast: boolean;
}

function getTranslation(word: SessionWord, lang: string | null): string {
  switch (lang) {
    case 'RU':
      return word.translationRu;
    case 'UK':
      return word.translationUk;
    default:
      return word.translationEn;
  }
}

export function FlashcardExercise({ word, onAnswer, isLast: _isLast }: FlashcardExerciseProps) {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [flipped, setFlipped] = useState(false);

  const handleAnswer = (knew: boolean) => {
    onAnswer({
      wordId: word.wordId,
      givenAnswer: knew ? 'KNOWN' : 'UNKNOWN',
      isCorrect: knew,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('exercises.flashcards.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('exercises.flashcards.instruction')}
      </Typography>

      <Card
        variant="outlined"
        sx={{
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <CardActionArea
          onClick={() => setFlipped(true)}
          sx={{
            height: '100%',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            {word.baseForm}
          </Typography>

          {flipped ? (
            <Typography variant="h5" color="primary" sx={{ mt: 2, textAlign: 'center' }}>
              {getTranslation(word, user?.nativeLanguage ?? null)}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('exercises.flashcards.tapToFlip')}
            </Typography>
          )}
        </CardActionArea>
      </Card>

      {flipped && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" color="error" onClick={() => handleAnswer(false)} size="large">
            {t('exercises.flashcards.didNotKnow')}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAnswer(true)}
            size="large"
          >
            {t('exercises.flashcards.knew')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
