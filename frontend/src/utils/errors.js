export function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED' || !err?.response) {
    return 'Cannot reach the server. Check that the backend is running and try again.';
  }
  return 'Something went wrong. Please try again.';
}
