import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7, 
  Logout, 
  AccountCircle, 
  Article as ArticleIcon,
  People,
  Home,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { 
      label: 'Beranda', 
      path: '/', 
      icon: <Home />, 
      show: true 
    },
    { 
      label: 'Artikel', 
      path: '/articles', 
      icon: <ArticleIcon />, 
      show: !!user 
    },
    { 
      label: 'Kelola Pengguna', 
      path: '/users', 
      icon: <People />, 
      show: user?.role === 'admin' 
    },
  ];

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Fullstack App
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
      {user && (
        <>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <Chip
                  label={user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                  size="small"
                  color={user.role === 'admin' ? 'primary' : 'default'}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <Divider />
        </>
      )}
      
      <List>
        {menuItems
          .filter(item => item.show)
          .map((item) => (
            <ListItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                cursor: 'pointer',
                bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem onClick={toggleDarkMode} sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? 'Mode Terang' : 'Mode Gelap'} />
        </ListItem>
        
        {user ? (
          <>
            <ListItem onClick={handleProfileMenuOpen} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Profil" />
            </ListItem>
            <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Keluar" />
            </ListItem>
          </>
        ) : (
          <ListItem onClick={() => handleNavigation('/auth')} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Masuk" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>

          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
            onClick={() => navigate('/')}
          >
            {isMobile ? 'Viruma' : 'Fullstack App Viruma'}
          </Typography>
          

          {!isMobile && user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Button
                color="inherit"
                startIcon={<Home />}
                onClick={() => handleNavigation('/')}
                variant={isActive('/') ? 'outlined' : 'text'}
              >
                Beranda
              </Button>
              
              <Button
                color="inherit"
                startIcon={<ArticleIcon />}
                onClick={() => handleNavigation('/articles')}
                variant={isActive('/articles') ? 'outlined' : 'text'}
              >
                Artikel
              </Button>
              
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  startIcon={<People />}
                  onClick={() => handleNavigation('/users')}
                  variant={isActive('/users') ? 'outlined' : 'text'}
                >
                  Pengguna
                </Button>
              )}
            </Box>
          )}
          

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            )}
            
            {!isMobile && user ? (
              <>
                <Chip
                  avatar={<Avatar sx={{ width: 24, height: 24 }}>{user.username[0].toUpperCase()}</Avatar>}
                  label={`${user.username} (${user.role === 'admin' ? 'admin' : 'pengguna'})`}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={handleProfileMenuOpen}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem onClick={handleProfileMenuClose}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Keluar
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/auth')}
                >
                  Masuk
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      

      {mobileMenu}
    </>
  );
};

export default Navbar;
