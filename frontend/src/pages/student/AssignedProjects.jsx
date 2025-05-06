import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Alert, Button } from '@mui/material';
import { format } from 'date-fns';

const AssignedProjects = () => {
  const { currentUser } = useAuth();
  const [assignedProject, setAssignedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Log user info immediately
  useEffect(() => {
    const logUserInfo = async () => {
      if (currentUser) {
        try {
          console.log('Current user object:', currentUser);
          const token = await currentUser.getIdToken();
          console.log('User token (first 10 chars):', token.substring(0, 10));
          
          const userDetails = {
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            phoneNumber: currentUser.phoneNumber,
          };
          
          console.log('User details:', userDetails);
          setUserInfo(userDetails);
          
          // Get user claims
          const idTokenResult = await currentUser.getIdTokenResult();
          console.log('User claims:', idTokenResult.claims);
        } catch (err) {
          console.error('Error getting user info:', err);
        }
      } else {
        console.log('No current user');
      }
    };
    
    logUserInfo();
  }, [currentUser]);

  const fetchDebugData = async () => {
    try {
      if (!currentUser) {
        console.log('No user to fetch debug data');
        return;
      }
      
      const token = await currentUser.getIdToken();
      console.log('DEBUG: Fetching user data from backend...');
      
      const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('DEBUG: User response status:', userResponse.status);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('DEBUG: User data from backend:', userData);
        setDebugInfo(prev => ({ ...prev, userData }));
      } else {
        console.log('DEBUG: Failed to fetch user data');
      }
    } catch (err) {
      console.error('DEBUG: Error fetching debug data:', err);
    }
  };

  useEffect(() => {
    const fetchAssignedProject = async () => {
      if (!currentUser) {
        console.log('No current user, cannot fetch assigned project');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

        // First, let's check if the student has preferences with an assigned project
        const token = await currentUser.getIdToken();
        console.log('Token for API calls:', token.substring(0, 10) + '...');

        // Debug: Check student preferences directly
        console.log('DEBUG: Fetching student preferences...');
        const prefsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/preferences`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('DEBUG: Preferences response status:', prefsResponse.status);
        
        if (prefsResponse.ok) {
          const prefsData = await prefsResponse.json();
          console.log('DEBUG: Student preferences data:', prefsData);
          setDebugInfo(prev => ({ ...prev, preferences: prefsData }));
          
          // Check if there's an assigned project ID
          if (prefsData.preferences && prefsData.preferences.length > 0) {
            const hasAssignedProject = prefsData.preferences.some(pref => pref.assigned_project_id);
            console.log('DEBUG: Has assigned project:', hasAssignedProject);
            if (hasAssignedProject) {
              const assignedPref = prefsData.preferences.find(pref => pref.assigned_project_id);
              console.log('DEBUG: Assigned project ID from preferences:', assignedPref?.assigned_project_id);
              setDebugInfo(prev => ({ 
                ...prev, 
                assignedProjectId: assignedPref?.assigned_project_id 
              }));
            } else {
              console.log('DEBUG: No assigned project ID found in preferences');
            }
          } else {
            console.log('DEBUG: No preferences found or empty preferences array');
          }
        } else {
          console.log('DEBUG: Failed to fetch student preferences:', prefsResponse.status);
          const errorText = await prefsResponse.text();
          console.log('DEBUG: Preferences error response:', errorText);
        }

        // Now fetch the assigned project
        console.log('DEBUG: Fetching assigned project...');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/assigned-project`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('DEBUG: Assigned project response status:', response.status);
        let data;
        try {
          data = await response.json();
          console.log('DEBUG: Assigned project response data:', data);
        } catch (err) {
          console.error('DEBUG: Error parsing JSON response:', err);
          const text = await response.text();
          console.log('DEBUG: Raw response text:', text);
          data = { success: false, message: 'Failed to parse response' };
        }
        
        setDebugInfo(prev => ({ ...prev, apiResponse: data }));

        if (!response.ok) {
          if (response.status === 404) {
            console.log('DEBUG: No project assigned (404)');
            setAssignedProject(null);
            setError(data.message || "No project has been assigned to you yet.");
          } else {
            console.log('DEBUG: Error response from assigned-project endpoint');
            throw new Error(data.message || 'Failed to fetch assigned project');
          }
        } else {
          console.log('DEBUG: Successfully fetched assigned project');
          console.log('DEBUG: Setting assigned project data:', data);
          setAssignedProject(data);
          setError(null);
        }
      } catch (err) {
        console.error('DEBUG: Error in fetchAssignedProject:', err);
        setError(err.message || 'Failed to fetch assigned project');
        setDebugInfo(prev => ({ ...prev, error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      console.log('DEBUG: Current user exists, fetching assigned project');
      fetchAssignedProject();
      fetchDebugData();
    } else {
      console.log('DEBUG: No current user, skipping fetch');
    }
  }, [currentUser]);

  const refreshData = () => {
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (debugInfo) {
    console.log('DEBUG: Complete debug info:', debugInfo);
  }

  // Extract project and group data if available
  const project = assignedProject?.project;
  const group = assignedProject?.group;
  
  console.log('DEBUG: Final project data:', project);
  console.log('DEBUG: Final group data:', group);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Assigned Project
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={refreshData}
        sx={{ mb: 2 }}
      >
        Refresh Data
      </Button>

      {userInfo && (
        <Box mb={3} p={2} border="1px solid #ddd" borderRadius={1}>
          <Typography variant="h6">User Information</Typography>
          <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </Box>
      )}

      {debugInfo && (
        <Box mb={3} p={2} border="1px solid #ddd" borderRadius={1}>
          <Typography variant="h6">Debug Information</Typography>
          <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </Box>
      )}

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : !project || !group ? (
        <Alert severity="info" sx={{ mb: 3 }}>No project has been assigned to you yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Project Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {project.title}
                </Typography>
                
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Client: {project.client_name}
                </Typography>

                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.requirements}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Skills Required
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.skills_required}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Resources
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.resources}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      Category: {project.main_category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      Sub-category: {project.sub_category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      Team Size: {project.max_team_size}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Group Details */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Group: {group.name}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Group Members:
                </Typography>

                {group.members.map((member) => (
                  <Box key={member.id} mb={1}>
                    <Typography variant="body2">
                      • {member.name} ({member.email})
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Status: {member.member_status}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AssignedProjects; 