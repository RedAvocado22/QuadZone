import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import { categoriesApi } from 'src/api/categories';
import type { CategoryResponse } from 'src/api/types';

// ----------------------------------------------------------------------

interface CategoryEditFormProps {
  categoryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryEditForm({ categoryId, onSuccess, onCancel }: CategoryEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
    productCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const loadCategory = async () => {
      setLoadingCategory(true);
      setError(null);
      try {
        const category = await categoriesApi.getById(categoryId);
        setFormData({
          name: category.name || '',
          description: '', // Description not in CategoryResponse
          active: category.active ?? true,
          productCount: category.productCount ?? 0,
          createdAt: new Date().toISOString().slice(0, 10),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
      } finally {
        setLoadingCategory(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'productCount' ? Number(value) : value,
      }));
      setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    const payload: Partial<Omit<CategoryResponse, 'id' | 'productCount'>> = {
      name: formData.name,
      active: formData.active,
      imageUrl: null, // Add if needed from form
    };

    setLoading(true);
    try {
      await categoriesApi.update(categoryId, payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Edit Category</Typography>
          <Button variant="outlined" onClick={onCancel}>
            ← Back
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="Name"
                required
                value={formData.name}
                onChange={handleChange('name')}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                minRows={3}
                value={formData.description}
                onChange={handleChange('description')}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label={formData.active ? "Active" : "Inactive"}
              />

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Product Count"
                  value={formData.productCount}
                  onChange={handleChange('productCount')}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Created At"
                  InputLabelProps={{ shrink: true }}
                  value={formData.createdAt}
                  onChange={handleChange('createdAt')}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
