import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'src/routing/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { categoriesApi } from 'src/api/categories';
interface SubCategoryCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubCategoryCreateView(props: SubCategoryCreateFormProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAllCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = useCallback(async () => {
    if (!name.trim() || !categoryId) return alert('Please fill all fields');

    try {
      setSaving(true);
      await categoriesApi.createSubCategory(categoryId as number, {
        name,
        active,
      });
      router.push('/admin/category');
    } catch (e) {
      console.error(e);
      alert('Failed to create subcategory');
    } finally {
      setSaving(false);
    }
  }, [name, active, categoryId, router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Create SubCategory</Typography>
      </Box>

      <Card sx={{ p: 3, maxWidth: 500 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            <TextField
              select
              label="Select Category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="SubCategory Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Status"
              value={active ? 'active' : 'inactive'}
              onChange={(e) => setActive(e.target.value === 'active')}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Create'}
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </Card>
    </DashboardContent>
  );
}
