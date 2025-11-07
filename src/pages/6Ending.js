import { useGame } from "../context/GameContext";

function Ending() {
    const { addItem } = useGame();

    return (
        <h1>탈출 성공</h1>
    );
}

export default Ending;
