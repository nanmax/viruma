import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Article } from '../types';
import { articlesAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { useGlobalSocket } from '../contexts/useGlobalSocket';
import { useAuth } from '../contexts/AuthContext';

interface ArticleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  article?: Article | null;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ open, onClose, onSuccess, article }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: '', content: '' });

  const { showNotification } = useNotification();
  const { user } = useAuth();
  const { emit } = useGlobalSocket();

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({ title: '', content: '' });
  }, [article, open]);

  const validateForm = () => {
    const newErrors = { title: '', content: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (article) {
        await articlesAPI.update(article.id, title.trim(), content.trim(), user?.id || 0);
        showNotification('Artikel berhasil diperbarui', 'success');
      } else {
        await articlesAPI.create(title.trim(), content.trim(), user?.id || 0);
        showNotification('Artikel berhasil dibuat', 'success');
        
        emit('new-article', { 
          title: title.trim(), 
          author: user?.username,
          timestamp: new Date().toISOString(),
          userId: user?.id
        });
      }
      
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 
        `Failed to ${article ? 'update' : 'create'} article`;
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {article ? 'Edit Article' : 'Create New Article'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              autoFocus
              label="Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={loading}
              placeholder="Enter article title..."
            />
            
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={12}
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
              disabled={loading}
              placeholder="Write your article content here..."
              sx={{
                '& .MuiInputBase-root': {
                  alignItems: 'flex-start'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
              <Typography variant="caption">
                Title: {title.length} characters
              </Typography>
              <Typography variant="caption">
                Content: {content.length} characters
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || !title.trim() || !content.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (article ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ArticleForm;
