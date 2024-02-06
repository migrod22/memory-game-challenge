import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit'
import { loadLoggedInUserFromLocalStorage, loadUsersFromLocalStorage } from './loadUsers';

const initialUsers = loadUsersFromLocalStorage();
const loggedUser = loadLoggedInUserFromLocalStorage()



const usersReducer = (state: any = { users: initialUsers }, action) => {
    switch (action.type) {
        case 'ADD_USER':
            const usernameToAdd = action.payload;
            if (state.users.some(user => user.username === usernameToAdd)) {
                // alert(`Logged in as ${usernameToAdd}`)
                return state;
            }
            return {
                ...state,
                users: [...state.users, { username: usernameToAdd, score: 0 }],
            };
        case 'UPDATE_USER_SCORE':
            const { username, score } = action.payload;
            // console.log(' state.users', state.users)
            // console.log('username', username)
            // console.log(' state.users.map((user) => user.username === username', state.users.map((user) => user.username))
            // console.log(' state.users.map((user) => user.username === username', username.username)

            return {
                ...state,
                users: state.users.map((user) =>
                    user.username === username.username ? { ...user, score } : user
                ),
            };
        case 'GET_USERS':
            // const usernameToRetrieve = action.payload;
            // const retrievedUser = state.users.find(user => user.username === usernameToRetrieve.username);
            // if (retrievedUser) {
            //     return {
            //         ...state,
            //         retrievedUser,
            //     };
            // }
            return state.users;
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

// const loggedInUserReducer = (state = { loggedInUser: null }, action) => {
//     switch (action.type) {
// case 'SET_LOGGED_IN_USER':
//     const usernameLoggedIn = action.payload;
//     return {
//         ...state,
//         loggedInUser: { username: usernameLoggedIn },
//     };
//         default:
//             return state;
//     }
// };

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



const store = configureStore({
    reducer: {
        users: usersReducer,
        loggedInUser: loggedInUserReducer,
    },
    preloadedState: {
        loggedInUser: {
            loggedInUser: loggedUser,
        },
    },
})

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('users', JSON.stringify(state.users.users));
    localStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser.loggedInUser));
});

export default store
