import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function LoadPage() {
    const { isLoggedIn, userId, refreshInventory } = useGame();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLoad = async (slot) => {
        if (!isLoggedIn || !userId) {
            setMessage("로그인 후 이용해주세요");
            return;
        }

        try {
            const url = `http://localhost:8080/save_load?id=${encodeURIComponent(userId)}&save_slots=${encodeURIComponent(slot)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = (await res.text()).trim();
            setMessage(text || "로드 결과가 없습니다");
            await refreshInventory();

            // 서버 메시지에 따라 라우팅
            if (text.includes("교실")) {
                navigate("/1Class");
            } else if (text.includes("교무")) {
                navigate("/2Teacher");
            } else if (text.includes("과학")) {
                navigate("/3Science");
            } else if (text.includes("출구")) {
                navigate("/5Exit");
            }
        } catch (e) {
            console.error(e);
            setMessage("서버 연결 실패");
        }
    };

    return (
        <Layout>
            <h1>세이브 불러오기</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => handleLoad(1)}>세이브 1</button>
                <button onClick={() => handleLoad(2)}>세이브 2</button>
                <button onClick={() => handleLoad(3)}>세이브 3</button>
            </div>
            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </Layout>
    );
}

export default LoadPage;
