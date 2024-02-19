export default function Card({ card, handleChoice, turned, disabled }) {

    const handleClick = () => {
        if (!disabled) {
            handleChoice(card)
        }
    }

    return (
        <div onClick={handleClick}>
            <div className={`transform transition-transform ${turned ? "rotate-y-0" : "rotate-y-90"}`}>
                <img alt="card" className="block border-2 border-white rounded h-60 w-60" src={turned ? card.url : "/img/memoryGame.jpeg"} />
            </div>
        </div>
    )
}
