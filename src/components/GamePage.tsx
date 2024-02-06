import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../utils/store';

export default function GamePage() {
    // const loggedUser = useSelector((state: any) => state.loggedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userScore, setUserScore] = useState<number>(null)

    // console.log('userScore', userScore)

    const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);
    // console.log('loggedInUser game page', loggedInUser)

    // if (!loggedInUser) {
    //     navigate('/');
    //     // return
    // }

    // useEffect(() => {
    //     if (!loggedInUser) {
    //         console.log('entrou')

    //     }
    // }, [loggedInUser])




    // console.log('loggedUser game page', loggedInUser)
    // console.log('entrou game',)


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



    const updatedScoreToTest = () => {

        dispatch({
            type: 'UPDATE_USER_SCORE',
            payload: { username: loggedInUser, score: userScore + 1 }
        });
        getUserScore()
    }


    return (
        <>
            <div>
                <h1>Game Page</h1>
                <h2>{loggedInUser.username}</h2>
                {userScore}
                <button onClick={handleLogout}>
                    Logout
                </button>
                <button onClick={updatedScoreToTest}>
                    updatedScoreToTest
                </button>
            </div>
        </>
    )
}

