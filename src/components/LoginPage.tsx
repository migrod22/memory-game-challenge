import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setInputUsername] = useState('');
    const dispatch = useDispatch();


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
        <div className=" min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Login Page</h1>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
