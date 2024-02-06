import React from 'react'
import { useSelector } from 'react-redux';

export default function ScorePage({ onClose, userScore }) {

    const allUsers = useSelector((state: any) => state.users.users);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md">
                <h1 className="text-2xl font-bold mb-4">Scores</h1>
                {allUsers.map((user) => (
                    <h1>{user.username} - {user.score}</h1>
                ))}

                <button onClick={onClose} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
                    Back to game
                </button>
            </div>
        </div>
    )
}
