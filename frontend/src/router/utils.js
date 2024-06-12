export const saveUserDataToLocalStorage = userData => {
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('accessToken', userData.token); // Token speichern
};

export const removeUserDataFromLocalStorage = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('accessToken');
};

export const getUserDataFromLocalStorage = () => {
  const storedUserData = localStorage.getItem('userData');
  return storedUserData ? JSON.parse(storedUserData) : null;
};

export const isUserLoggedIn = async () => {
  // try {
  //     withCredentials: true,
  //   });
  //   if (!response.data.user) {
  //     removeUserDataFromLocalStorage();
  //     return false;
  //   }
  //   saveUserDataToLocalStorage(response.data.user);
  //   return true;
  // } catch (error) {
  //   console.error("Error fetching user data:", error);
  //   return false;
  // }
};

export const hasAnyRole = async routeRoles => {
  const userData = getUserDataFromLocalStorage();
  const userRoles = userData ? userData.role : [];
  if (userRoles?.includes('admin')) return true;

  return routeRoles?.some(role => userRoles.includes(role));
};
