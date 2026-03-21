import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { School } from '@mui/icons-material';

import { useAppSelector } from '../../store';
import { useCategories } from '../../api/content';
import { getLocalizedName } from '../../shared/lib/content-utils';

export function ExercisesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { data: categories, isLoading, error, refetch } = useCategories();

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
      <Typography variant="h4" gutterBottom>
        {t('exercises.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('exercises.subtitle')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {categories?.map((category) => (
          <Card key={category.id} variant="outlined">
            <CardActionArea onClick={() => navigate(`/exercises/${category.id}`)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School color="primary" />
                <Typography variant="h6">
                  {getLocalizedName(category, user?.nativeLanguage ?? null)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
