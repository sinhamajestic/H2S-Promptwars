export const apiFetch = async (url: string, options?: RequestInit) => {
  return fetch(url, options);
};
