import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';

import { DashboardContent } from 'src/layouts/dashboard';
import { postsApi } from 'src/api/posts';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function PostDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await postsApi.getById(id);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      router.push(`/admin/blog/${id}/edit`);
    }
  };

  const handleBack = () => {
    router.push('/admin/blog');
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !post) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Post not found'}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Blog
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Post Details</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
          </Box>
        </Box>

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            {post.coverUrl && (
              <Box
                component="img"
                src={post.coverUrl}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: 360,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            )}

            <Box>
              <Typography variant="h5" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fDate(post.postedAt)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={post.author?.avatarUrl} alt={post.author?.name} />
              <Typography variant="subtitle1">{post.author?.name}</Typography>
            </Box>

            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {post.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Views: {fShortenNumber(post.totalViews || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comments: {fShortenNumber(post.totalComments || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shares: {fShortenNumber(post.totalShares || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favorites: {fShortenNumber(post.totalFavorites || 0)}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
