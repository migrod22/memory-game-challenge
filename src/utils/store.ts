import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { loadGameStateFromLocalStorage, loadLoggedInUserFromLocalStorage, loadUsersFromLocalStorage } from './loadUsers';

const initialUsers = loadUsersFromLocalStorage();
const loggedUser = loadLoggedInUserFromLocalStorage()
// const gameStateStored = loadGameStateFromLocalStorage()

const usersReducer = (state: any = { users: initialUsers }, action) => {

    switch (action.type) {
        case 'ADD_USER':
            const usernameToAdd = action.payload;
            if (state.users.some(user => user.username === usernameToAdd)) {
                return state;
            }
            return {
                ...state,
                users: [...state.users, { username: usernameToAdd, score: 0 }],
            };
        case 'UPDATE_USER_SCORE':
            const { username, score } = action.payload;
            const userToUpdate = state.users.find(user => user.username === username.username);

            if (userToUpdate.score === 0 || userToUpdate.score == null) {
                return {
                    ...state,
                    users: state.users.map(user => user.username === username.username ? { ...user, score } : user
                    ),
                };
            } else if (userToUpdate.score !== 0 && score < userToUpdate.score) {
                return {
                    ...state,
                    users: state.users.map((user) =>
                        user.username === username.username ? { ...user, score } : user
                    ),
                };
            }
            return state;

        case 'GET_USER':
            const usernameToRetrieve = action.payload;
            const retrievedUser = state.users.find(user => user.username === usernameToRetrieve.username);
            if (retrievedUser) {
                return {
                    ...state,
                    retrievedUser,
                };
            }
            return state;
        default:
            return state;
    }
};

const loggedInUserReducer = (state = { loggedInUser: null }, action) => {
    switch (action.type) {
        case 'SET_LOGGED_IN_USER':
            const usernameLoggedIn = action.payload;
            return {
                ...state,
                loggedInUser: { username: usernameLoggedIn },
            };
        case 'LOGOUT':
            localStorage.removeItem('loggedInUser');
            return {
                ...state,
                loggedInUser: null,
            };
        default:
            return state;
    }
};

const gameStateReducer = (state = {
    cards: null,
    turns: null,
    choiceOne: null,
    choiceTwo: null,
    disabled: null,
    seconds: null,
    timerRunning: null,
    userScore: null
}, action) => {
    switch (action.type) {
        case 'SET_GAME_STATE':
            return action.payload;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    users: usersReducer,
    loggedInUser: loggedInUserReducer,
    gameState: gameStateReducer
});

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
        loggedInUser: {
            loggedInUser: loggedUser,
        },
        // gameState: gameStateStored,
    },
});

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('users', JSON.stringify(state.users.users));
    localStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser.loggedInUser));
    // localStorage.setItem('gameState', JSON.stringify(state.gameState));

});

export default store;
