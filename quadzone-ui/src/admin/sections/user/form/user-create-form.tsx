import { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { usersApi, type User } from 'src/api/users';
import { uploadApi } from 'src/api/upload';

// ----------------------------------------------------------------------

interface UserCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserCreateForm({ onSuccess, onCancel }: UserCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarMethod, setAvatarMethod] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    company: '',
    role: 'CUSTOMER',
    avatarUrl: '',
    isVerified: false,
    status: 'active',
  });

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

  const handleSwitchChange = (field: 'isVerified' | 'status') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (field === 'status') {
      setFormData((prev) => ({
        ...prev,
        status: event.target.checked ? 'active' : 'banned',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    }
    setError(null);
  };

  const handleAvatarMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: 'url' | 'upload' | null
  ) => {
    if (newMethod !== null) {
      setAvatarMethod(newMethod);
      // Clear preview and URL when switching methods
      setPreviewUrl('');
      setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const result = await uploadApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, avatarUrl: result.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Invalid email format');
      }

      await usersApi.create(formData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="text"
            onClick={onCancel}
            sx={{ minWidth: 'auto' }}
          >
            ← Back
          </Button>
          <Typography variant="h4">Create New User</Typography>
        </Box>

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Avatar Section */}
              <Stack spacing={2}>
                <Typography variant="h6">Avatar</Typography>
                
                <ToggleButtonGroup
                  value={avatarMethod}
                  exclusive
                  onChange={handleAvatarMethodChange}
                  aria-label="avatar method"
                  fullWidth
                >
                  <ToggleButton value="url" aria-label="url">
                    URL
                  </ToggleButton>
                  <ToggleButton value="upload" aria-label="upload">
                    Upload
                  </ToggleButton>
                </ToggleButtonGroup>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={previewUrl || formData.avatarUrl || undefined}
                    alt={formData.name || 'User'}
                    sx={{ width: 80, height: 80 }}
                  >
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    {avatarMethod === 'url' ? (
                      <TextField
                        fullWidth
                        label="Avatar URL"
                        value={formData.avatarUrl}
                        onChange={handleChange('avatarUrl')}
                        placeholder="https://example.com/avatar.jpg"
                        helperText="Enter a valid image URL"
                      />
                    ) : (
                      <Stack spacing={1}>
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
                          startIcon={
                            uploading ? (
                              <CircularProgress size={16} />
                            ) : undefined
                          }
                          disabled={uploading}
                          fullWidth
                        >
                          {uploading ? 'Uploading...' : 'Choose Image'}
                        </Button>
                        {previewUrl && (
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={handleRemoveImage}
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
                          >
                            Remove
                          </Button>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Max file size: 5MB. Supported formats: JPG, PNG, GIF
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Box>
              </Stack>

              <Divider />

              {/* Basic Information */}
              <Stack spacing={2}>
                <Typography variant="h6">Basic Information</Typography>
                
                <TextField
                  fullWidth
                  label="Name"
                  required
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!formData.name.trim() && formData.name !== ''}
                  helperText={!formData.name.trim() && formData.name !== '' ? 'Name is required' : ''}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!formData.email.trim() && formData.email !== ''}
                  helperText={!formData.email.trim() && formData.email !== '' ? 'Email is required' : ''}
                />

                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={handleChange('company')}
                />
              </Stack>

              <Divider />

              {/* Role and Status */}
              <Stack spacing={2}>
                <Typography variant="h6">Role & Status</Typography>
                
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => handleChange('role')({ target: { value: e.target.value } })}
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="STAFF">Staff</MenuItem>
                    <MenuItem value="CUSTOMER">Customer</MenuItem>
                    <MenuItem value="SHIPPER">Shipper</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 'active'}
                      onChange={handleSwitchChange('status')}
                    />
                  }
                  label={formData.status === 'active' ? 'Active' : 'Banned'}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVerified}
                      onChange={handleSwitchChange('isVerified')}
                    />
                  }
                  label="Verified"
                />
              </Stack>

              <Divider />

              {/* Actions */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !formData.name.trim() || !formData.email.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="solar:check-circle-bold" />}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

