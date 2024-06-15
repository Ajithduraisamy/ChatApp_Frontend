import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const UserProfile = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!user) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }

                if (!userId) {
                    setError('User ID not found.');
                    setLoading(false);
                    return;
                }

                const token = user.token;
                const response = await axios.get(`https://chatapp-backend-09n7.onrender.com/user-profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setProfile(response.data.user); // Update to extract user data from response
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setError('Error fetching user profile.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, userId]);

    if (loading) {
        return <div className="container mt-5">Loading...</div>; // Bootstrap class for margin top
    }

    if (error) {
        return <div className="container mt-5">Error: {error}</div>; // Bootstrap class for margin top
    }

    return (
        <div className="container mt-5">
            <h2>User Profile</h2>
            <div className="card">
                <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {profile.username}</p>
                    <p className="card-text"><strong>Email:</strong> {profile.email}</p>
                    {/* Add other profile data as needed */}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
