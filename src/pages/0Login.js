import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Login() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/1Class">
            <h1>로그인 페이지</h1>
            <button onClick={() => addItem("열쇠")}>열쇠 줍기 🔑</button>
        </Layout>
    );
}

export default Login;
