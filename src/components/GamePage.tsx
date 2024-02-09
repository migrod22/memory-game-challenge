import { useState, useEffect } from 'react'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../utils/store';
import ScorePage from './ScorePage';
import { CardType, GameStateType, LoggedUserType } from '../utils/interfaces';


function GamePage({ pexelCards }) {

    const loggedInUser = useSelector((state: LoggedUserType) => state.loggedInUser.loggedInUser);
    // const gameState = useSelector((state: GameStateType) => state.gameState);


    const [userScore, setUserScore] = useState<number>(null)
    const [showScoresModal, setShowScoresModal] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(0);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [cards, setCards] = useState<CardType[]>([])
    const [choiceOne, setChoiceOne] = useState<CardType>(null)
    const [choiceTwo, setChoiceTwo] = useState<CardType>(null)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [prevCardId, setPrevCardId] = useState<number>(null);

    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameEnded, setGameEnded] = useState<boolean>(false);


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

    // I've left this comment below because I intend to fix this situation in the future

    // const shuffleCards = () => {
    //     // const storedGameState = JSON.parse(localStorage.getItem('gameState'));

    //     // if (storedGameState) {
    //     //     const updatedCards = pexelCards.map(card => {
    //     //         const matchedCard = storedGameState.cards.find(savedCard => savedCard.id === card.id);
    //     //         return matchedCard ? { ...card, matched: matchedCard.matched } : card;
    //     //     });

    //     //     setCards(updatedCards);
    //     //     setChoiceOne(storedGameState.choiceOne);
    //     //     setChoiceTwo(storedGameState.choiceTwo);
    //     //     setSeconds(storedGameState.seconds);
    //     //     setDisabled(storedGameState.disabled);
    //     //     setTimerRunning(storedGameState.timerRunning);
    //     // } else {
    //     //     setCards(pexelCards);
    //     // }

    //     setGameEnded(false);
    //     setGameStarted(true);
    //     setSeconds(0);
    //     setChoiceOne(null);
    //     setChoiceTwo(null);
    //     setPrevCardId(null);
    //     setTimerRunning(true);
    // };



    const shuffleCards = () => {
        const shuffledCards = [...pexelCards].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setGameStarted(true);
        setSeconds(0);
        setChoiceOne(null);
        setChoiceTwo(null);
        setPrevCardId(null);
        setTimerRunning(true);
    };

    const handleClickCard = (card) => {
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
        const allCardsMatched = cards.every(card => card.matched);
        if (cards && gameStarted && !gameEnded && allCardsMatched) {
            setTimerRunning(false)
            setGameEnded(true);
        }
    }, [cards]);


    useEffect(() => {
        if (gameEnded) {
            updatedScore(seconds);
        }
    }, [gameEnded]);


    useEffect(() => {
        dispatch({
            type: 'SET_GAME_STATE',
            payload: {
                cards,
                choiceOne,
                choiceTwo,
                disabled,
                seconds,
                timerRunning,
                userScore
            }
        });
    }, [cards, choiceOne, choiceTwo, disabled, timerRunning, userScore]);


    // I've left this comment below because I intend to fix this situation in the future

    // useEffect(() => {
    //     localStorage.setItem('gameState', JSON.stringify(gameState));
    // }, [gameState]);

    // useEffect(() => {
    //     const storedGameState = JSON.parse(localStorage.getItem('gameState'));
    //     if (storedGameState) {
    //         dispatch({ type: 'SET_GAME_STATE', payload: storedGameState });
    //     }
    // }, []);

    // useEffect(() => {
    //     shuffleCards()
    //     setGameStarted(true)
    //     setTimerRunning(true)
    //     setGameEnded(false)
    // }, [])



    return (
        <div className="bg-blue-200 min-h-screen flex justify-center items-center">
            <div className=" p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl text-center font-bold mb-4">Game Page</h1>
                <h1 className="text-3xl text-center font-bold mb-4">{loggedInUser.username}</h1>
                <p className="mb-4 text-xl text-center">Best score - {userScore}</p>

                {gameEnded && <h1 className="bg-green-400 p-2 rounded-md mb-4 text-center">We have a winner!!</h1>}

                <p className='text-center text-2xl font-bold'>Timer: {seconds}</p>

                <div className="mt-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                    <button
                        onClick={shuffleCards}
                        className="p-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 transition duration-300"
                    >
                        New Game
                    </button>
                    <button
                        onClick={handleOpenScoreModal}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Scores
                    </button>
                </div>

                {showScoresModal && <ScorePage onClose={handleCloseScoreModal} />}

                <div className="grid grid-cols-4 grid-rows-3 gap-4 mt-6">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            handleChoice={handleClickCard}
                            turned={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
}

export default GamePage
