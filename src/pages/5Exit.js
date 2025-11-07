import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Exit() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/6Ending">
            <h1>출구</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Exit;
