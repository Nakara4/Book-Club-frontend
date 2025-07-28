import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

export const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const isAuthenticated = Boolean(user);

  return { user, login, logout, isAuthenticated };
};

