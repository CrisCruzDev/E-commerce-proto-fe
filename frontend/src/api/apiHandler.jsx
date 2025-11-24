export const apiHandler = async apiCall => {
  try {
    // ⚠️ MOST IMPORTANT: return the axios promise
    const response = await apiCall();

    // Normalize backend formats
    // Supports both:
    // { data: {...} }
    // { ... }
    return response.data?.data ?? response.data;
  } catch (error) {
    // Network / CORS / server offline
    if (!error.response) {
      throw new Error(
        `Network error — backend unreachable. Possible causes:
- CORS blocked
- Server offline
- Wrong URL (${error.config?.url})
- HTTPS/HTTP mismatch`
      );
    }

    const status = error.response.status;

    // Custom backend message
    const message = error.response.data?.message;

    if (message) throw new Error(message);

    if (status === 401) throw new Error('Unauthorized — please log in again');
    if (status === 403) throw new Error('Forbidden — no permission');

    // Fallback
    throw new Error('Unexpected server error');
  }
};
