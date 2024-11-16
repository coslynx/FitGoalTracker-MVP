import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';
import { User } from '../../api/models/userModel';
import authService from '../services/authService';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedUserData = await authService.getUserProfile();
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUpdateError("Failed to load profile. Please try again later.");
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (field: keyof User, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await authService.updateUserProfile(userData!);
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError("Failed to update profile. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      {updateError && <Typography color="error">{updateError}</Typography>}
      {userData ? (
        <>
          <Input label="Name" type="text" value={userData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
          <Input label="Email" type="email" value={userData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleUpdateProfile} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <Typography>Loading profile...</Typography>
      )}
    </Container>
  );
};

export default Profile;
```