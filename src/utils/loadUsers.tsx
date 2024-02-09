export const loadUsersFromLocalStorage = () => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
};


export const loadLoggedInUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
};

export const loadGameStateFromLocalStorage = () => {
    const storeGameState = localStorage.getItem('gameState');
    return storeGameState ? JSON.parse(storeGameState) : null;
};