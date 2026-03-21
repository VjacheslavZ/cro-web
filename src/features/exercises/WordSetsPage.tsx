import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { useAppSelector } from '../../store';
import { useWordSets } from '../../api/content';
import { useCreateSession } from '../../api/exercises';
import type { CreateSessionResponse } from '../../api/exercises';
import { getLocalizedName } from '../../shared/lib/content-utils';
import { CycleResetDialog } from './CycleResetDialog';

export function WordSetsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const user = useAppSelector((state) => state.auth.user);
  const { data: wordSets, isLoading, error, refetch } = useWordSets(categoryId ?? '');
  const createSession = useCreateSession();

  const [cycleResetInfo, setCycleResetInfo] = useState<{
    wordSetId: string;
    exerciseType: string;
  } | null>(null);

  const handleStartExercise = async (wordSetId: string, exerciseType: string) => {
    try {
      const result: CreateSessionResponse = await createSession.mutateAsync({
        wordSetId,
        exerciseType,
      });

      if (result.cycleExhausted) {
        setCycleResetInfo({ wordSetId, exerciseType });
        return;
      }

      if (result.session) {
        navigate(`/exercises/session/${result.session.id}`, {
          state: {
            words: result.session.words,
            exerciseType: result.session.exerciseType,
            totalQuestions: result.session.totalQuestions,
          },
        });
      }
    } catch {
      // Error is handled by mutation state
    }
  };

  const handleCycleReset = () => {
    if (cycleResetInfo) {
      handleStartExercise(cycleResetInfo.wordSetId, cycleResetInfo.exerciseType);
    }
    setCycleResetInfo(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t('common.retry')}
            </Button>
          }
        >
          {t('common.error')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/exercises')} sx={{ mb: 2 }}>
        {t('exercises.title')}
      </Button>

      <Typography variant="h4" gutterBottom>
        {t('exercises.wordSets')}
      </Typography>

      {(!wordSets || wordSets.length === 0) && (
        <Typography color="text.secondary">{t('exercises.noWordSets')}</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {wordSets?.map((ws) => (
          <Card key={ws.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">
                  {getLocalizedName(ws, user?.nativeLanguage ?? null)}
                </Typography>
                <Chip
                  label={t('exercises.words', { count: ws.wordCount })}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStartExercise(ws.id, 'JEDNINA_MNOZINA')}
                  disabled={createSession.isPending}
                >
                  {t('exercises.types.jedninaMnozina')}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleStartExercise(ws.id, 'FLASHCARDS')}
                  disabled={createSession.isPending}
                >
                  {t('exercises.types.flashcards')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {createSession.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t('common.error')}
        </Alert>
      )}

      <CycleResetDialog
        open={cycleResetInfo !== null}
        onReset={handleCycleReset}
        onClose={() => setCycleResetInfo(null)}
        wordSetId={cycleResetInfo?.wordSetId ?? ''}
        exerciseType={cycleResetInfo?.exerciseType ?? ''}
      />
    </Container>
  );
}
