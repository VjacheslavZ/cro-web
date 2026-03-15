import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Language as LanguageIcon, Settings, Logout } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store';
import { clearAuth } from '../store/auth.slice';

const APP_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [dictAnchor, setDictAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setUserAnchor(null);
    dispatch(clearAuth());
    navigate('/login', { replace: true });
  };

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

        {isAuthenticated && user ? (
          <>
            <Button color="inherit" onClick={() => navigate('/exercises')}>
              {t('nav.exercises')}
            </Button>

            <Button
              color="inherit"
              onMouseEnter={(e) => setDictAnchor(e.currentTarget)}
              onClick={() => navigate('/dictionary')}
            >
              {t('nav.dictionary')}
            </Button>

            <Menu
              anchorEl={dictAnchor}
              open={Boolean(dictAnchor)}
              onClose={() => setDictAnchor(null)}
              slotProps={{ list: { onMouseLeave: () => setDictAnchor(null) } }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem
                onClick={() => {
                  setDictAnchor(null);
                  navigate('/dictionary/my');
                }}
              >
                {t('nav.myDictionary')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDictAnchor(null);
                  navigate('/dictionary/collections');
                }}
              >
                {t('nav.collections')}
              </MenuItem>
            </Menu>

            <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar src={user.avatarUrl ?? undefined} alt={user.name}>
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={() => setUserAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem disabled>
                <ListItemText primary={t('header.role')} secondary={user.role} />
              </MenuItem>
              <MenuItem disabled>
                <ListItemText primary={t('header.xp')} secondary={user.xpTotal} />
              </MenuItem>
              <MenuItem disabled>
                <ListItemText primary={t('header.streak')} secondary={user.currentStreak} />
              </MenuItem>
              {user.nativeLanguage && (
                <MenuItem disabled>
                  <ListItemText
                    primary={t('header.nativeLanguage')}
                    secondary={user.nativeLanguage}
                  />
                </MenuItem>
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  setUserAnchor(null);
                  navigate('/settings');
                }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('header.settings')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('header.logout')}</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <IconButton color="inherit" onClick={(e) => setLangAnchor(e.currentTarget)}>
              <LanguageIcon />
            </IconButton>

            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => setLangAnchor(null)}
            >
              {APP_LANGUAGES.map((lang) => (
                <MenuItem
                  key={lang.code}
                  selected={i18n.language === lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setLangAnchor(null);
                  }}
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
