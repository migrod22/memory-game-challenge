export default function Card({ card, handleChoice, flipped, disabled }) {

    const handleClick = () => {
        if (!disabled) {
            handleChoice(card)
        }
    }

    return (
        <div className="card" onClick={handleClick}>
            <div className={`transform transition-transform ${flipped ? "rotate-y-0" : "rotate-y-90"}`}>
                <img className="block border-2 border-white rounded h-60 w-60" src={flipped ? card.url : "/img/memoryGame.jpeg"} alt={flipped ? "card front" : "cover"} />
            </div>
        </div>
    )
}
