// src/components/NextButton.js
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function NextButton({ nextPath }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useGame();

    return (
        <button
            onClick={() => {
                if (!isLoggedIn) {
                    alert("로그인 후 이용해주세요");
                    return;
                }
                navigate(nextPath);
            }}
            style={{
                padding: "10px 20px",
                marginTop: "20px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
            }}
        >
            다음으로
        </button>
    );
}

export default NextButton;

