export type CardType = {
    id: number;
    url: string,
    matched: boolean
}

export type LoggedUserType = {
    loggedInUser: {
        loggedInUser: {
            username: string
        }
    }
}

export type GameStateType = {
    gameState: {
        cards: CardType[],
        choiceOne: CardType,
        choiceTwo: CardType
        disabled: boolean
        seconds: number,
        timerRunning: boolean
        userScore: number
    }
}
