import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ScorePage from './components/ScorePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { useSelector } from 'react-redux';
import GamePage from './components/GamePage';
import axios from 'axios';

const App = () => {
  const [userName, setUserName] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const { users } = useSelector((state: any) => state.users);
  const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);

  const [pexelCards, setPexelCards] = useState([])

  const [defaultImage, setDefaultImage] = useState(null)


  const fetchSingleImage = async () => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/curated?per_page=1`,
        { headers: { Authorization: '84CptlFQLYfWj0euXgTzdGohgvSjyaG03MDtDgTLnK6CITNCybJKGjTZ' } }
      );
      setDefaultImage(response.data.photos)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        "https://api.pexels.com/v1/curated?per_page=6",
        { headers: { Authorization: '84CptlFQLYfWj0euXgTzdGohgvSjyaG03MDtDgTLnK6CITNCybJKGjTZ' } }
      );
      const images = response.data.photos.slice(0, 6).map(photo => photo.src.medium);
      const duplicatedImages = [...images, ...images];
      const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
      setPexelCards(
        shuffledImages.map((url) => ({ url, matched: false }))
          .map((card) => ({ ...card, id: Math.random() }))
      );

      // console.log('pexelCards', pexelCards)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {

    fetchSingleImage()
    fetchImages();

  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={loggedInUser ? (<Navigate to="/game" />)
            :
            (<LoginPage />)
          }
          />
          <Route
            path="/"
            element={loggedInUser ? <PrivateRoutes /> : <Navigate to="/" />}
          >
            <Route path='game' element={<GamePage defaultImage={defaultImage} pexelCards={pexelCards} />} />
            <Route path="game/score" element={<ScorePage userScore={null} onClose={null} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

