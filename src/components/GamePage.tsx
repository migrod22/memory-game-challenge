import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import store from '../utils/store';
import ScorePage from './ScorePage';
import axios from 'axios';



export default function GamePage() {
    // const loggedUser = useSelector((state: any) => state.loggedUser);
    const gridSize = 12; // 4x3 grid
    const totalPairs = gridSize / 2;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userScore, setUserScore] = useState<number>(null)
    const [showScoresModal, setShowScoresModal] = useState<boolean>(false);

    const [seconds, setSeconds] = useState<number>(0);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false)


    const [defaultImage, setDefaultImage] = useState([])
    console.log('defaultImage', defaultImage[0])
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [timer, setTimer] = useState(0);
    const [scores, setScores] = useState([]);


    const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);


    useEffect(() => {
        let timerId;
        if (timerRunning && gameStarted) {
            timerId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        return () => {
            clearInterval(timerId);
        };
    }, [timerRunning]);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };


    const getUserScore = async () => {
        await dispatch({ type: 'GET_USER', payload: loggedInUser });
        const updatedState = store.getState();
        const retrievedUser = updatedState.users.retrievedUser;
        setUserScore(retrievedUser ? retrievedUser.score : null)
    };


    useEffect(() => {
        getUserScore()
    }, [])



    // const updatedScoreToTest = () => {

    //     dispatch({
    //         type: 'UPDATE_USER_SCORE',
    //         payload: { username: loggedInUser, score: userScore + 1 }
    //     });
    //     getUserScore()
    // }

    const handleOpenScoreModal = () => {
        setShowScoresModal(true)
        setTimerRunning(false);
    }

    const handleCloseScoreModal = () => {
        setShowScoresModal(false)
        setTimerRunning(true)
    }


    const handleStartGame = () => {
        setGameStarted(true)
        setTimerRunning(true)
    }


    // const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchSingleImage = async () => {
            try {
                const response = await axios.get(
                    `https://api.pexels.com/v1/curated?per_page=1`,
                    { headers: { Authorization: '84CptlFQLYfWj0euXgTzdGohgvSjyaG03MDtDgTLnK6CITNCybJKGjTZ' } }
                );
                console.log('response', response.data.photos[0])
                setDefaultImage(response.data.photos)
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchSingleImage()

        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    `https://api.pexels.com/v1/curated?per_page=${totalPairs}`,
                    { headers: { Authorization: '84CptlFQLYfWj0euXgTzdGohgvSjyaG03MDtDgTLnK6CITNCybJKGjTZ' } }
                );
                const images = response.data.photos.slice(0, totalPairs).map(photo => photo.src.medium);
                const duplicatedImages = [...images, ...images];
                const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
                setCards(shuffledImages.map((url, index) => ({ url, index, flipped: false })));
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();

    }, []);

    const handleCardClick = (index) => {
        if (flippedIndices.length === 2) {
            return;
        }

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {

            const [firstIndex, secondIndex] = newFlippedIndices;
            const newCards = [...cards];

            if (newCards[firstIndex].url === newCards[secondIndex].url) {

                newCards[firstIndex].flipped = true;
                newCards[secondIndex].flipped = true;
                setCards(newCards);
                setFlippedIndices([]);
            } else {

                setTimeout(() => {
                    newCards[firstIndex].flipped = false;
                    newCards[secondIndex].flipped = false;
                    setCards(newCards);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };


    const checkForMatch = (flippedIndices) => {
        const [firstIndex, secondIndex] = flippedIndices;
        const newCards = [...cards];

        if (newCards[firstIndex].url === newCards[secondIndex].url) {
            // match
            newCards[firstIndex].flipped = true;
            newCards[secondIndex].flipped = true;
            setMatchedPairs((prev) => prev + 1);
        } else {
            // no match, reset cards after a short delay
            setTimeout(() => {
                newCards[firstIndex].flipped = false;
                newCards[secondIndex].flipped = false;
                setFlippedIndices([]);
                setCards(newCards);
            }, 1000);
        }

        if (matchedPairs === totalPairs) {
            // game over, handle saving score
            const newScores = [...scores, { loggedInUser, time: timer }];
            setScores(newScores);
            alert(`Congratulations, ${loggedInUser}! You won in ${timer} seconds.`);
        }
    };



    console.log('cards', cards)



    return (
        <div className="bg-blue-200 min-h-screen flex justify-center items-center">
            <div>
                <h1 className="text-2xl font-bold mb-4">Game Page</h1>
                <h1 className="text-5xl font-bold mb-4">{loggedInUser.username}</h1>
                <p className="mb-4">{userScore}</p>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300"
                >
                    Logout
                </button>
                {seconds ? seconds : <p>no time yet</p>}
                <button className='p-2 mr-2 bg-blue-500 text-white rounded' onClick={handleStartGame}>Start Game</button>
                {/* <button
                    onClick={updatedScoreToTest}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                >
                    Update Score Test
                </button> */}
                <button
                    onClick={handleOpenScoreModal}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Scores
                </button>

                {showScoresModal && <ScorePage userScore={userScore} onClose={handleCloseScoreModal} />}
                <div>
                    {/* <h1>Welcome, {loggedInUser}!</h1> */}
                    <div className="game-board grid grid-cols-4 gap-4">
                        {cards.map((card) => (
                            <div
                                key={card.index}
                                className={`card ${card.flipped ? 'flipped' : ''} border border-gray-300 bg-white rounded-md flex items-center justify-center`}
                                onClick={() => !card.flipped && handleCardClick(card.index)}
                            >
                                {card.flipped ? (
                                    <img src={card.url} alt={`Card ${card.index}`} className="w-48 h-48 object-cover" />
                                ) : (
                                    <img src={defaultImage[0].src.small} alt="Back of card" className="w-48 h-48 object-cover" />
                                )}

                            </div>
                        ))}
                    </div>

                    <p>Timer: {timer} seconds</p>
                    <Link to="/game/scores">View High Scores</Link>
                </div>
            </div>
        </div>
    )
}

