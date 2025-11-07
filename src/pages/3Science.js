import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Science() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/4Ghost">
            <h1>과학실</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Science;
