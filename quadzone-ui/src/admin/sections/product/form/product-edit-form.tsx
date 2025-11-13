import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { productsApi, type Product } from 'src/api/products';
import { uploadApi } from 'src/api/upload';

// ----------------------------------------------------------------------

interface ProductEditFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductEditForm({ productId, onSuccess, onCancel }: ProductEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    priceSale: null,
    coverUrl: '',
    colors: [],
    status: '',
    description: '',
  });

  useEffect(() => {
    const loadProduct = async () => {
      setLoadingProduct(true);
      setError(null);
      try {
        const product = await productsApi.getById(productId);
        setFormData({
          name: product.name || '',
          price: product.price || 0,
          priceSale: product.priceSale ?? null,
          coverUrl: product.coverUrl || '',
          colors: product.colors || [],
          status: product.status || '',
          description: product.description || '',
        });
        if (product.coverUrl) {
          setPreviewUrl(product.coverUrl);
          if (product.coverUrl.startsWith('data:')) {
            setImageMethod('upload');
          } else {
            setImageMethod('url');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleImageMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: 'url' | 'upload' | null
  ) => {
    if (newMethod !== null) {
      setImageMethod(newMethod);
      setPreviewUrl('');
      setFormData((prev) => ({ ...prev, coverUrl: '' }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      const uploadResult = await uploadApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, coverUrl: uploadResult.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, coverUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.name || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await productsApi.update(productId, formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
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
          <Typography variant="h4">Edit Product</Typography>
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
                label="Product Name"
                required
                value={formData.name}
                onChange={handleChange('name')}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  required
                  value={formData.price || ''}
                  onChange={handleChange('price')}
                />
                <TextField
                  fullWidth
                  label="Sale Price (optional)"
                  type="number"
                  value={formData.priceSale || ''}
                  onChange={handleChange('priceSale')}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || ''}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description || ''}
                onChange={handleChange('description')}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Product Image
                </Typography>
                <ToggleButtonGroup
                  value={imageMethod}
                  exclusive
                  onChange={handleImageMethodChange}
                  aria-label="image method"
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="url" aria-label="url">
                    URL
                  </ToggleButton>
                  <ToggleButton value="upload" aria-label="upload">
                    Upload
                  </ToggleButton>
                </ToggleButtonGroup>

                {imageMethod === 'url' ? (
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={formData.coverUrl || ''}
                    onChange={handleChange('coverUrl')}
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <Box>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      sx={{ mr: 2 }}
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </Button>
                    {previewUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      >
                        Remove
                      </Button>
                    )}
                    {previewUrl && (
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                          mt: 2,
                          maxWidth: 200,
                          maxHeight: 200,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Update Product'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

