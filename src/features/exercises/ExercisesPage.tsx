import { useTranslation } from 'react-i18next';
import { Container, Typography, List, ListItemButton, ListItemText } from '@mui/material';

const EXERCISE_CATEGORIES = [
  { key: 'cases', route: '/exercises/cases' },
  { key: 'verbs', route: '/exercises/verbs' },
  { key: 'vocabulary', route: '/exercises/vocabulary' },
] as const;

export function ExercisesPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('exercises.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('exercises.subtitle')}
      </Typography>

      <List>
        {EXERCISE_CATEGORIES.map((cat) => (
          <ListItemButton key={cat.key} disabled>
            <ListItemText primary={t(`exercises.categories.${cat.key}`)} />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
}
