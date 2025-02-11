import { Box, Typography, Container, Grid, Paper } from '@mui/material';

function Home() {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        justifyContent: 'center'
      }}
    >
      <Box textAlign="center" mb={8}>
        <Typography 
          variant="h1" 
          className="text-gradient"
          sx={{ 
            mb: 3,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          Welcome to Nexus Shop
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Discover amazing tech products at great prices
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            className="card"
            sx={{
              p: 4,
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
          >
            <Typography 
              variant="h4" 
              className="text-gradient"
              sx={{ mb: 2 }}
            >
              Quality Products
            </Typography>
            <Typography color="text.secondary">
              Browse through our carefully curated collection of high-quality items.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            className="card"
            sx={{
              p: 4,
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
          >
            <Typography 
              variant="h4" 
              className="text-gradient"
              sx={{ mb: 2 }}
            >
              Fast Shipping
            </Typography>
            <Typography color="text.secondary">
              Get your orders delivered quickly and securely.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            className="card"
            sx={{
              p: 4,
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
          >
            <Typography 
              variant="h4" 
              className="text-gradient"
              sx={{ mb: 2 }}
            >
              24/7 Support
            </Typography>
            <Typography color="text.secondary">
              Our customer service team is always here to help.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home; 