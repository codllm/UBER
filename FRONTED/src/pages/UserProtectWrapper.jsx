import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/user-login');
    }
  }, [token, navigate]);

  if (!token) {
    return null; 
  }

  return children;
};

export default UserProtectWrapper;
