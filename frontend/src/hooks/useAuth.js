import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout } from '../store/features/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const handleLogin = (userData) => {
    dispatch(login(userData));
  };

  const handleRegister = (userData) => {
    dispatch(register(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { user, status, error, handleLogin, handleRegister, handleLogout };
};
