import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
import { createBlog } from 'src/api';
import { uploadApi } from 'src/api/upload';
import { useUser } from 'src/hooks/useUser';

// Validation schema
const blogCreateSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  content: yup
    .string()
    .required('Content is required')
    .min(100, 'Content must be at least 100 characters'),
  thumbnailUrl: yup
    .string()
    .test('is-valid-image-path', 'Must be a valid URL or local image path', (value: string | null | undefined) => {
      if (!value) return true;
      if (value.startsWith('http://') || value.startsWith('https://')) return true;
      if (value.startsWith('/src/assets/img') || value.startsWith('@img')) return true;
      return false;
    })
    .nullable(),
  status: yup
    .string()
    .oneOf(['DRAFT', 'PUBLISHED'], 'Invalid status')
    .required('Status is required'),
  imageMethod: yup
    .string()
    .oneOf(['url', 'upload'], 'Invalid image method')
    .required(),
});

interface BlogCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  title: string;
  content: string;
  thumbnailUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
  imageMethod: 'url' | 'upload';
}

/**
 * Blog Create Form Component
 *
 * Features:
 * - Formik form management with Yup validation
 * - Rich text editor (React Quill) for content
 * - Image upload (local file or URL)
 * - Blog status selection (DRAFT, PUBLISHED)
 * - Auto-slug generation from title (handled by backend)
 * - Form validation with error messages
 * - Loading states during submission and upload
 *
 * Usage:
 * ```tsx
 * <BlogCreateForm onSuccess={() => router.push('/admin/blog')} />
 * ```
 */
export function BlogCreateForm({ onSuccess, onCancel }: Readonly<BlogCreateFormProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const [previewUrl, setPreviewUrl] = useState('');

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      status: 'DRAFT',
      imageMethod: 'url',
    },
    validationSchema: blogCreateSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        if (!user?.id) {
          setStatus('User not authenticated');
          setSubmitting(false);
          return;
        }

        // Validate publish requirements
        if (values.status === 'PUBLISHED') {
          if (!values.thumbnailUrl.trim()) {
            setStatus('Featured image is required to publish');
            setSubmitting(false);
            return;
          }
        }

        const blogData = {
          title: values.title.trim(),
          content: values.content.trim(),
          thumbnailUrl: values.thumbnailUrl.trim() || undefined,
          authorId: user.id,
        };

        await createBlog(blogData);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create blog';
        setStatus(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: 'url' | 'upload' | null
  ) => {
    if (newMethod !== null) {
      formik.setFieldValue('imageMethod', newMethod);
      formik.setFieldValue('thumbnailUrl', '');
      setPreviewUrl('');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      formik.setFieldError('thumbnailUrl', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      formik.setFieldError('thumbnailUrl', 'Image size must be less than 5MB');
      return;
    }

    formik.setSubmitting(true);
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to service
      const result = await uploadApi.uploadImage(file);
      formik.setFieldValue('thumbnailUrl', result.imageUrl);
      formik.setFieldError('thumbnailUrl', undefined);
    } catch (error: any) {
      formik.setFieldError('thumbnailUrl', error?.message || 'Failed to upload image');
      setPreviewUrl('');
    } finally {
      formik.setSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue('thumbnailUrl', '');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Create Blog Post</Typography>
          <Button variant="outlined" onClick={onCancel} disabled={formik.isSubmitting}>
            ← Back
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {/* Error message */}
              {formik.status && <Alert severity="error">{formik.status}</Alert>}

              {/* Title */}
              <TextField
                fullWidth
                name="title"
                label="Blog Title"
                required
                placeholder="e.g., Getting Started with React"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />

              {/* Content */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Blog Content <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    overflow: 'hidden',
                    ...(formik.touched.content && formik.errors.content && {
                      borderColor: '#d32f2f',
                    }),
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={formik.values.content}
                    onChange={(value) => {
                      formik.setFieldValue('content', value);
                      formik.setFieldTouched('content', true);
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ size: ['small', false, 'large', 'huge'] }],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['link', 'image'],
                        ['clean'],
                      ],
                    }}
                    placeholder="Write your blog content here..."
                  />
                </Box>
                {formik.touched.content && formik.errors.content && (
                  <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 1 }}>
                    {formik.errors.content}
                  </Typography>
                )}
              </Box>

              {/* Status */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Status"
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1 }}>
                    {formik.errors.status}
                  </Typography>
                )}
              </FormControl>

              {/* Featured Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Featured Image
                  {formik.values.status === 'PUBLISHED' && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                <ToggleButtonGroup
                  value={formik.values.imageMethod}
                  exclusive
                  onChange={handleImageMethodChange}
                  aria-label="image method"
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="url" aria-label="url">
                    Use URL
                  </ToggleButton>
                  <ToggleButton value="upload" aria-label="upload">
                    Upload
                  </ToggleButton>
                </ToggleButtonGroup>

                {formik.values.imageMethod === 'url' ? (
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={formik.values.thumbnailUrl}
                    onChange={formik.handleChange('thumbnailUrl')}
                    onBlur={formik.handleBlur}
                    placeholder="https://example.com/image.jpg"
                    error={formik.touched.thumbnailUrl && Boolean(formik.errors.thumbnailUrl)}
                    helperText={formik.touched.thumbnailUrl && formik.errors.thumbnailUrl}
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
                    >
                      {formik.isSubmitting ? 'Uploading...' : 'Choose Image'}
                    </Button>
                    {formik.values.thumbnailUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                        disabled={formik.isSubmitting}
                      >
                        Remove
                      </Button>
                    )}
                    {formik.errors.thumbnailUrl && formik.touched.thumbnailUrl && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 1 }}>
                        {formik.errors.thumbnailUrl}
                      </Typography>
                    )}
                    {previewUrl && (
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                          mt: 2,
                          maxWidth: 300,
                          maxHeight: 200,
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>

              {/* Form Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={formik.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  startIcon={
                    formik.isSubmitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Iconify icon="mingcute:add-line" />
                    )
                  }
                >
                  {formik.isSubmitting ? 'Creating...' : 'Create Blog Post'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
