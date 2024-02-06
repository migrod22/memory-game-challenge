import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GamePage from './components/GamePage';
import ScorePage from './components/ScorePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { useSelector } from 'react-redux';

const App = () => {
  const [userName, setUserName] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const { users } = useSelector((state: any) => state.users);
  const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);

  console.log('loggedInUser APP', loggedInUser)
  console.log('entrou',)


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
            <Route path='game' element={<GamePage />} />
            <Route path="game/score" element={<ScorePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

