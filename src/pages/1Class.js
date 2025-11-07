import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Class() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/2Teacher">
            <h1>교실</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Class;
