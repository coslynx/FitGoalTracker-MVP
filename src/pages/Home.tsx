import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Grid, Container } from '@mui/material';
import MyButton from '../components/Button';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h3" component="h1" align="center">
                    Fitness Goal Tracker
                </Typography>
                <Typography variant="h6" align="center">
                    Achieve your fitness goals with ease.
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
                        <Typography variant="h6">Set & Track Goals</Typography>
                        <Typography variant="body1">Easily define your fitness objectives and monitor your progress with our intuitive goal-setting tools.</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
                        <Typography variant="h6">Visual Progress Tracking</Typography>
                        <Typography variant="body1">Visualize your achievements with interactive charts and graphs, staying motivated and accountable.</Typography>
                    </Box>
                </Grid>
                {/* Add more feature highlights as needed */}
            </Grid>

            <Box mt={4}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <MyButton label="Sign Up" onClick={handleSignUp} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MyButton label="Log In" onClick={handleLogin} fullWidth />
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                    &copy; {new Date().getFullYear()} Fitness Goal Tracker
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
```