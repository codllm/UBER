import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptionDataContext } from '../context/captionContext';
import axios from 'axios';

const captionProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const {caption, setCaption} = React.useContext(CaptionDataContext);
  const [isloading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/caption-login');
    }
  }, [token, navigate]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/captions/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      setCaption(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching caption profile:', error.response ? error.response.data : error.message);
      localStorage.removeItem('token');
      navigate('/caption-login');
    }
  )

  if(isloading){
    return(
      <div className="w-full h-screen flex items-center justify-center">
        <div className="loader">Loadig...</div>
      </div>
    );
  }

  if (!token) {
    return null; 
  }

  return children;
};

export default captionProtectWrapper;
