import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function HintForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const room = parseInt(params.get("room") || "0", 10);
    const next = params.get("next") || "/";

    const { userId, isLoggedIn, roomNumber } = useGame();

    const [id, setId] = useState(userId || "");
    const [text, setText] = useState("");
    const [msg, setMsg] = useState("");

    const currentRoom = room || roomNumber;

    const submit = async () => {
        if (!isLoggedIn) {
            alert("로그인 후 이용해주세요");
            return;
        }
        if (!id) {
            setMsg("아이디를 입력하세요");
            return;
        }
        if (!text) {
            setMsg("힌트를 입력하세요");
            return;
        }
        if (text.length > 15) {
            setMsg("힌트는 15자 이내로 작성해주세요");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/save_hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, num: currentRoom, text })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const t = (await res.text()).trim();
            setMsg(t || "저장되었습니다");
            // 저장 후 게임 세이브 호출 후 다음 스테이지 이동
            try {
                const saveUrl = `http://localhost:8080/game_save?id=${encodeURIComponent(id)}&save_slots=1`;
                await fetch(saveUrl, { method: 'GET' });
            } catch (_) {}
            setTimeout(() => navigate(next), 300);
        } catch (e) {
            console.error(e);
            setMsg("서버 오류로 저장에 실패했습니다");
        }
    };

    return (
        <Layout>
            <h1>힌트 남기기</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 340 }}>
                <div>현재 방: {currentRoom}</div>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <textarea
                    placeholder="힌트 (최대 15자)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={15}
                    rows={3}
                    style={{ resize: "none" }}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => navigate(-1)}>취소</button>
                    <button onClick={submit}>저장</button>
                </div>
                {msg && <div style={{ color: "#444" }}>{msg}</div>}
            </div>
        </Layout>
    );
}

export default HintForm;
