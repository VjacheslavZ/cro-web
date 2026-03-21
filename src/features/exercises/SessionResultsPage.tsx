import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { EmojiEvents, LocalFireDepartment } from '@mui/icons-material';

interface ResultsLocationState {
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  currentStreak: number;
}

export function SessionResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  if (!state) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>{t('common.error')}</Typography>
        <Button onClick={() => navigate('/exercises')} sx={{ mt: 2 }}>
          {t('exercises.results.backToExercises')}
        </Button>
      </Container>
    );
  }

  const { correctAnswers, totalQuestions, xpEarned, currentStreak } = state;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card variant="outlined">
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <EmojiEvents sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />

          <Typography variant="h4" gutterBottom>
            {t('exercises.results.title')}
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('exercises.results.score', {
              correct: correctAnswers,
              total: totalQuestions,
            })}
          </Typography>

          <Typography variant="h4" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
            {t('exercises.results.xpEarned', { xp: xpEarned })}
          </Typography>

          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}
          >
            <LocalFireDepartment color="warning" />
            <Typography variant="h6">
              {t('exercises.results.streak', { streak: currentStreak })}
            </Typography>
          </Box>

          <Button variant="contained" size="large" onClick={() => navigate('/exercises')}>
            {t('exercises.results.backToExercises')}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
