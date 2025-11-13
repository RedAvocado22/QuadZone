import { useState, useEffect, useRef } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type PostSearchProps = {
  onSearch?: (searchValue: string) => void;
  sx?: SxProps<Theme>;
};

export function PostSearch({ onSearch, sx }: PostSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounce
    timeoutRef.current = setTimeout(() => {
      onSearch?.(searchValue);
    }, 300);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <TextField
      sx={{ width: 280, ...sx }}
      placeholder="Search post..."
      value={searchValue}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
