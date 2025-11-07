import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Teacher() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/3Science">
            <h1>교무실</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Teacher;
