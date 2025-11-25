import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

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
import { productsApi, type Product } from 'src/api/productsAdmin';
import { uploadApi } from 'src/api/upload';
import { yupName, yupPrice, yupUrl, yupOptionalNumber } from 'src/utils/Validation';

// ----------------------------------------------------------------------

interface ProductEditFormProps {
  productId: string | number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  name: string;
  price: number;
  priceSale: number | null;
  coverUrl: string;
  status: string;
  description: string;
  imageMethod: 'url' | 'upload';
}

const productEditSchema = yup.object({
  name: yupName,
  price: yupPrice,
  priceSale: yupOptionalNumber,
  coverUrl: yupUrl,
  status: yup.string(),
  description: yup.string().nullable(),
  imageMethod: yup.string().oneOf(['url', 'upload']).required(),
});

export function ProductEditForm({ productId, onSuccess, onCancel }: ProductEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      price: 0,
      priceSale: null,
      coverUrl: '',
      status: '',
      description: '',
      imageMethod: 'url',
    },
    validationSchema: productEditSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const id = typeof productId === 'string' ? Number(productId) : productId;
        if (isNaN(id)) {
          formik.setStatus('Invalid product ID');
          return;
        }
        const productData = {
          name: values.name,
          price: values.price,
          imageUrl: values.coverUrl || '',
          description: values.description || '',
          status: values.status || '',
        } as Partial<Product> & { status?: string };

        await productsApi.update(id, productData);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update product';
        setStatus(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const id = typeof productId === 'string' ? Number(productId) : productId;
        if (isNaN(id)) {
          formik.setStatus('Invalid product ID');
          return;
        }
        const product = await productsApi.getById(id);
        const imageMethod = product.imageUrl?.startsWith('data:') ? 'upload' : 'url';

        formik.setValues({
          name: product.name || '',
          price: product.price || 0,
          priceSale: null,
          coverUrl: product.imageUrl || '',
          status: product.isActive ? '' : 'locked',
          description: product.description || '',
          imageMethod,
        });
      } catch (error: any) {
        formik.setStatus(error?.message || 'Failed to load product');
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleImageMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: 'url' | 'upload' | null
  ) => {
    if (newMethod !== null) {
      formik.setFieldValue('imageMethod', newMethod);
      formik.setFieldValue('coverUrl', '');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      formik.setFieldError('coverUrl', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      formik.setFieldError('coverUrl', 'Image size must be less than 5MB');
      return;
    }

    formik.setSubmitting(true);
    try {
      const result = await uploadApi.uploadImage(file);
      formik.setFieldValue('coverUrl', result.url);
      formik.setFieldError('coverUrl', undefined);
    } catch (error: any) {
      formik.setFieldError('coverUrl', error?.message || 'Failed to upload image');
    } finally {
      formik.setSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue('coverUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewUrl = formik.values.coverUrl && formik.values.imageMethod === 'upload'
    ? formik.values.coverUrl
    : '';

  if (formik.values.name === '' && !formik.status) {
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
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {formik.status && (
                <Alert severity="error" onClose={() => formik.setStatus(null)}>
                  {formik.status}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Product Name"
                name="name"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  required
                  value={formik.values.price || ''}
                  onChange={(e) => formik.setFieldValue('price', parseFloat(e.target.value) || 0)}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.price && formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
                <TextField
                  fullWidth
                  label="Sale Price (optional)"
                  name="priceSale"
                  type="number"
                  value={formik.values.priceSale || ''}
                  onChange={(e) => formik.setFieldValue('priceSale', e.target.value ? parseFloat(e.target.value) : null)}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.priceSale && formik.errors.priceSale)}
                  helperText={formik.touched.priceSale && formik.errors.priceSale}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.description && formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Product Image
                </Typography>
                <ToggleButtonGroup
                  value={formik.values.imageMethod}
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

                {formik.values.imageMethod === 'url' ? (
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="coverUrl"
                    value={formik.values.coverUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={!!(formik.touched.coverUrl && formik.errors.coverUrl)}
                    helperText={formik.touched.coverUrl && formik.errors.coverUrl}
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
                      disabled={formik.isSubmitting}
                      sx={{ mr: 2 }}
                      startIcon={formik.isSubmitting ? <CircularProgress size={16} /> : undefined}
                    >
                      {formik.isSubmitting ? 'Uploading...' : 'Choose Image'}
                    </Button>
                    {formik.values.coverUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      >
                        Remove
                      </Button>
                    )}
                    {formik.errors.coverUrl && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                        {formik.errors.coverUrl}
                      </Typography>
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
                <Button variant="outlined" onClick={onCancel} disabled={formik.isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <Iconify icon="solar:check-circle-bold" />}
                >
                  {formik.isSubmitting ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
