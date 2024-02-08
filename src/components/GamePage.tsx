import { useState, useEffect } from 'react'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../utils/store';
import ScorePage from './ScorePage';


function GamePage({ pexelCards }) {

    const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);

    const [userScore, setUserScore] = useState<number>(null)
    const [showScoresModal, setShowScoresModal] = useState<boolean>(false);

    const [seconds, setSeconds] = useState<number>(0);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);

    const [cards, setCards] = useState([])
    const [choiceOne, setChoiceOne] = useState(null)
    const [choiceTwo, setChoiceTwo] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [prevCardId, setPrevCardId] = useState(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();


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


    const updatedScore = (winnerSeconds) => {
        console.log('winnerSeconds inside updatedScore', winnerSeconds)
        dispatch({
            type: 'UPDATE_USER_SCORE',
            payload: { username: loggedInUser, score: winnerSeconds }
        });
        getUserScore();
    }


    const handleOpenScoreModal = () => {
        setShowScoresModal(true)
        setTimerRunning(false);
    }

    const handleCloseScoreModal = () => {
        setShowScoresModal(false)
        if (gameStarted) {
            setTimerRunning(true)
        }
        if (gameEnded) {
            shuffleCards()
        }
    }


    const shuffleCards = () => {
        setGameStarted(true)
        setSeconds(0)

        setChoiceOne(null)
        setChoiceTwo(null)
        setCards(pexelCards)
        setTimerRunning(true)
    }

    const handleChoice = (card) => {
        if (prevCardId === card.id || card.matched) {
            return;
        }

        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
        setPrevCardId(card.id);
    }

    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
        setPrevCardId(null);
    }

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true)

            if (choiceOne.url === choiceTwo.url) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.url === choiceOne.url) {
                            return { ...card, matched: true }
                        } else {
                            return card
                        }
                    })
                })
                resetTurn()
            } else {
                setTimeout(() => resetTurn(), 1000)
            }
        }
    }, [choiceOne, choiceTwo])




    useEffect(() => {
        let timerId;
        if (timerRunning) {
            timerId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        return () => {
            clearInterval(timerId);
        };
    }, [timerRunning]);




    useEffect(() => {
        const allMatched = cards.every(card => card.matched);
        if (gameStarted && allMatched) {
            setTimerRunning(false)
            setGameEnded(true);
        }
    }, [cards]);


    useEffect(() => {
        if (gameEnded) {
            console.log('gameEnded', gameEnded)
            console.log('You won with the score of ', seconds);
            updatedScore(seconds);
        }
    }, [gameEnded]);




    return (
        <div className="bg-blue-200 min-h-screen flex justify-center items-center z-0">
            <div>
                <h1 className="text-2xl font-bold mb-4">Game Page</h1>
                <h1 className="text-5xl font-bold mb-4">{loggedInUser.username}</h1>
                <p className="mb-4">Score - {userScore}</p>
                <p>Timer: {seconds}</p>

                <div className='mb-4'>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded mr-2" onClick={shuffleCards}>New Game</button>
                    <button
                        onClick={handleOpenScoreModal}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Scores
                    </button>

                </div>

                {showScoresModal && <ScorePage onClose={handleCloseScoreModal} />}
                <div className="grid grid-cols-4 grid-rows-3 gap-4">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            handleChoice={handleChoice}
                            flipped={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GamePage
