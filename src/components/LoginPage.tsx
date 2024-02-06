import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setInputUsername] = useState('');
    const dispatch = useDispatch();
    // const loggedInUser = useSelector((state: any) => state.loggedInUser.loggedInUser);
    // console.log('loggedInUser', loggedInUser)


    const handleLogin = () => {
        if (inputUsername.trim() === '') {
            alert('Enter a valid username');
        } else {
            dispatch({
                type: 'ADD_USER',
                payload: inputUsername,
            });

            dispatch({
                type: 'SET_LOGGED_IN_USER',
                payload: inputUsername,
            });

            navigate('/game');
        }
    };

    return (
        <div className='bg-red-500'>
            <h1 >Login Page</h1>
            <input
                type="text"
                placeholder="Enter username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
