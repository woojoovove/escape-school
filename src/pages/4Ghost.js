import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Ghost() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/5Exit">
            <h1>귀신</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Ghost;
