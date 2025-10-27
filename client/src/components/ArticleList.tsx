import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  AccessTime,
  Person,
  Close
} from '@mui/icons-material';
import { Article } from '../types';
import { articlesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ArticleForm from './ArticleForm';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const { user } = useAuth();
  const { showNotification } = useNotification();

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll();
      
      const articlesData = response.data;
      
      if (Array.isArray(articlesData)) {
        setArticles(articlesData);
      } else {
        setArticles([]);
        showNotification('Invalid data format received', 'error');
      }
    } catch (error: any) {
      setArticles([]);
      showNotification(error.response?.data?.message || 'Failed to fetch articles', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchArticles();
    
    const handleArticleRefresh = () => {
      setTimeout(() => {
        fetchArticles();
      }, 500);
    };

    window.addEventListener('article-refresh', handleArticleRefresh);

    return () => {
      window.removeEventListener('article-refresh', handleArticleRefresh);
    };
  }, [fetchArticles]);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormOpen(true);
  };

  const handleView = (article: Article) => {
    setViewingArticle(article);
    setViewOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await articlesAPI.delete(id);
      showNotification('Article deleted successfully', 'success');
      fetchArticles();
    } catch (error) {
      showNotification('Failed to delete article', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingArticle(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchArticles();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Articles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {articles.length} article{articles.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {articles.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No articles found. {user && 'Create your first article by clicking the + button.'}
        </Alert>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: 3 
        }}>
          {Array.isArray(articles) && articles.map((article) => (
            <Card 
              key={article.id}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                }
              }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {article.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {article.author_name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(article.created_at)}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {article.content}
                  </Typography>
                  
                  {article.updated_at !== article.created_at && (
                    <Chip 
                      label="Edited" 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleView(article)}
                    variant="outlined"
                  >
                    View
                  </Button>
                  
                  {user?.role === 'admin' && (
                    <>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(article)}
                        variant="outlined"
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={deleteLoading === article.id ? <CircularProgress size={16} /> : <Delete />}
                        onClick={() => handleDelete(article.id)}
                        variant="outlined"
                        color="error"
                        disabled={deleteLoading === article.id}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
          ))}
        </Box>
      )}

      {user && (
        <Fab
          color="primary"
          aria-label="add article"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            zIndex: 1000
          }}
          onClick={() => setFormOpen(true)}
        >
          <Add />
        </Fab>
      )}

      <ArticleForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        article={editingArticle}
      />

      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {viewingArticle?.title}
          <IconButton onClick={() => setViewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {viewingArticle && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {viewingArticle.author_name} • {formatDate(viewingArticle.created_at)}
                  {viewingArticle.updated_at !== viewingArticle.created_at && 
                    ` • Updated: ${formatDate(viewingArticle.updated_at)}`
                  }
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {viewingArticle.content}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArticleList;
