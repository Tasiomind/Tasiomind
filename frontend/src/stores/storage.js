export const saveUserData = data => {
  localStorage.setItem('userData', JSON.stringify(data));
};

export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const saveAccessToken = token => {
  localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const saveRefreshToken = token => {
  localStorage.setItem('refreshToken', token);
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const clearStorage = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
