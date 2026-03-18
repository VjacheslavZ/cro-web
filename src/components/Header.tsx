import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

import { useAppSelector } from '../store';
import { LanguageMenu } from './header/LanguageMenu';
import { DictionaryMenu } from './header/DictionaryMenu';
import { UserMenu } from './header/UserMenu';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/')}
        >
          CroGrammar
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated && (
          <>
            <Button color="inherit" onClick={() => navigate('/exercises')}>
              {t('nav.exercises')}
            </Button>
            <DictionaryMenu />
            <UserMenu />
          </>
        )}

        {!isAuthenticated && <LanguageMenu />}
      </Toolbar>
    </AppBar>
  );
}
