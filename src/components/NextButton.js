// src/components/NextButton.js
import { useNavigate } from "react-router-dom";

function NextButton({ nextPath }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(nextPath)}
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
            다음으로 →
        </button>
    );
}

export default NextButton;
