const handleCreateGroups = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instructor/create-groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await currentUser.getIdToken()}`
      },
      body: JSON.stringify({ groupSize: parseInt(groupSize) })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create groups');
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to create groups');
    }

    // Show success message
    setSuccessMessage('Groups created successfully!');
    
    // Refresh the page after 2 seconds
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (err) {
    console.error('Error creating groups:', err);
    setError(err.message || 'Failed to create groups');
  } finally {
    setLoading(false);
  }
}; 