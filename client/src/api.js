const API_BASE = import.meta.env.VITE_API_BASE;

export const checkUsername = async (username) => {
  const res = await fetch(`${API_BASE}/api/users/check-username?username=${username}`);
  return await res.json(); // { available: true/false }
};

export const getCountries = async () => {
  const res = await fetch(`${API_BASE}/api/location/countries`);
  return await res.json();
};

export const getStates = async (country) => {
  const res = await fetch(`${API_BASE}/api/location/states?country=${country}`);
  return await res.json();
};

export const getCities = async (state) => {
  const res = await fetch(`${API_BASE}/api/location/cities?state=${state}`);
  return await res.json();
};

export const submitForm = async (formData) => {
  const res = await fetch(`${API_BASE}/api/users/submit`, {
    method: 'POST',
    body: formData, // formData because includes file upload
  });
  return await res.json();
};