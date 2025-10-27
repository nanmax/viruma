import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Person,
  TrendingUp,
  AccessTime,
  AdminPanelSettings,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { Article } from '../types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    userArticles: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll();
      
      const articles = response.data;
      if (Array.isArray(articles)) {
        setRecentArticles(articles.slice(0, 5));
        setStats({
          totalArticles: articles.length,
          userArticles: user ? articles.filter((article: Article) => article.author_id === user.id).length : 0,
        });
      } else {
        setRecentArticles([]);
        setStats({ totalArticles: 0, userArticles: 0 });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const articleDate = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return articleDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: articleDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 600 }}>
            <ArticleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Fullstack App Viruma
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              A modern platform for sharing and managing articles
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Join our community to create, share, and discover amazing articles. 
              Connect with writers and readers from around the world.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/auth')}
                sx={{ minWidth: 120 }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/articles')}
                sx={{ minWidth: 120 }}
              >
                Browse Articles
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
            {user.role === 'admin' ? 
              <AdminPanelSettings sx={{ fontSize: 40 }} /> : 
              <Person sx={{ fontSize: 40 }} />
            }
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user.username}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              You're logged in as {user.role}
            </Typography>
            <Chip 
              label={`${user.role.toUpperCase()} USER`}
              sx={{ 
                mt: 1, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {loading ? <CircularProgress size={24} /> : stats.totalArticles}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Articles
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {loading ? <CircularProgress size={24} /> : stats.userArticles}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your Articles
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Notifications sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                Live
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time Updates
              </Typography>
            </CardContent>
          </Card>
        </Stack>


        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

          <Paper elevation={2} sx={{ p: 3, flex: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Articles
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/articles')}
              >
                View All
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentArticles.length > 0 ? (
              <List sx={{ p: 0 }}>
                {recentArticles.map((article, index) => (
                  <React.Fragment key={article.id}>
                    <ListItem 
                      sx={{ 
                        px: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => navigate('/articles')}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ArticleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" noWrap>
                            {article.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              by {article.author_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              •
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(article.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentArticles.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No articles found. Create your first article!
              </Typography>
            )}
          </Paper>


          <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<ArticleIcon />}
                onClick={() => navigate('/articles')}
                fullWidth
              >
                View Articles
              </Button>
              {user.role === 'admin' && (
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => navigate('/articles')}
                fullWidth
              >
                Create Article
              </Button>
              )}
              
              {user.role === 'admin' && (
                <Button
                  variant="outlined"
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/users')}
                  fullWidth
                  color="secondary"
                >
                  Manage Users
                </Button>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
