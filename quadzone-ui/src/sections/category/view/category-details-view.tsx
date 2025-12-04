import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Label } from 'src/components/label';

import { DashboardContent } from 'src/layouts/dashboard';
import { categoriesApi } from 'src/api/categories';

// ----------------------------------------------------------------------

export function CategoryDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const loadCategory = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await categoriesApi.getById(Number(id));
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      router.push(`/admin/category/${id}/edit`);
    }
  };

  const handleBack = () => {
    router.push('/admin/category');
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

  if (error || !category) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Category not found'}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Categories
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Category Details</Typography>
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
          <Stack spacing={2}>
            <Typography variant="h5">{category.name}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status:
              </Typography>
              <Label color={category.status === 'active' ? 'success' : 'error'}>{category.status}</Label>
            </Box>

            {category.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{category.description}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Products: {category.productCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
