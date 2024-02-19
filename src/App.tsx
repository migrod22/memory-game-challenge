import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ScorePage from './components/ScorePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { useSelector } from 'react-redux';
import GamePage from './components/GamePage';
import axios from 'axios';
import { CardType, LoggedUserType } from './utils/interfaces';

const App = () => {

  const loggedInUser = useSelector((state: LoggedUserType) => state.loggedInUser.loggedInUser);

  const [pexelCards, setPexelCards] = useState<CardType[]>([])


  const fetchImages = async () => {
    try {
      const response = await axios.get(
        "https://api.pexels.com/v1/curated?per_page=6",
        { headers: { Authorization: process.env.REACT_APP_PEXELS_API_KEY } }
      );
      const images = response.data.photos.slice(0, 6).map(photo => photo.src.medium);
      const duplicatedImages = [...images, ...images];
      const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
      setPexelCards(
        shuffledImages.map((url) => ({ url, matched: false }))
          .map((card) => ({ ...card, id: Math.random() }))
      );
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
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
            <Route path='game' element={<GamePage pexelCards={pexelCards} />} />
            <Route path="game/score" element={<ScorePage onClose={null} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

