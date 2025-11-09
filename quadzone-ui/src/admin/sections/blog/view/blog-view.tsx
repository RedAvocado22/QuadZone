import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

import { usePosts } from 'src/hooks/usePosts';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';

import type { IPostItem } from '../post-item';

// ----------------------------------------------------------------------

export function BlogView() {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>('latest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  // Fetch posts from API
  const { posts, loading, error, total, refetch } = usePosts({
    page,
    pageSize: 12,
    search,
    sortBy,
  });

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort as 'latest' | 'popular' | 'oldest');
    setPage(0); // Reset to first page when sorting changes
  }, []);

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
    setPage(0); // Reset to first page when search changes
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // Pagination is 1-based, API is 0-based
  }, []);

  const totalPages = Math.ceil(total / 12);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Blog
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={refetch}
        >
          New post
        </Button>
      </Box>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <PostSearch onSearch={handleSearch} />
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">Error loading posts: {error.message}</Typography>
          <Button onClick={refetch} sx={{ mt: 2 }}>Retry</Button>
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No posts found</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {posts.map((post, index) => {
              const latestPostLarge = index === 0;
              const latestPost = index === 1 || index === 2;

              return (
                <Grid
                  key={post.id}
                  size={{
                    xs: 12,
                    sm: latestPostLarge ? 12 : 6,
                    md: latestPostLarge ? 6 : 3,
                  }}
                >
                  <PostItem post={post as IPostItem} latestPost={latestPost} latestPostLarge={latestPostLarge} />
                </Grid>
              );
            })}
          </Grid>

          <Pagination 
            count={totalPages} 
            page={page + 1}
            onChange={handlePageChange}
            color="primary" 
            sx={{ mt: 8, mx: 'auto' }} 
          />
        </>
      )}
    </DashboardContent>
  );
}
