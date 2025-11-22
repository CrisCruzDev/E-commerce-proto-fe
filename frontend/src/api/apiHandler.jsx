export const apiHandler = async apiCall => {
  try {
    const response = await apiCall();
    return response.data?.data || response.data; // normalize structure
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized — please log in again');
    }
    if (error.response?.status === 403) {
      throw new Error('You do not have permission for this action');
    }
    // NEW: catch cases where response is missing
    if (!error.response) {
      throw new Error(
        `Network error — backend not reached. Possible causes:
- CORS blocked
- Server offline
- Wrong URL (${error.config?.url})
- HTTPS/HTTP mismatch
`
      );
    }
    throw new Error('Server error or network issue');
  }
};
