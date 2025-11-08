import React, { useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [message, setMessage] = useState("");
    const { setIsLoggedIn, setUserId } = useGame();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!id || !pwd) {
            setIsLoggedIn(false);
            setMessage("아이디와 비밀번호를 입력하세요");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/login?id=${encodeURIComponent(id)}&pwd=${encodeURIComponent(pwd)}`,
                { method: "GET" }
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const text = (await response.text()).trim();
            const isSuccess = text.includes("성공") || /success/i.test(text);

            if (isSuccess) {
                setIsLoggedIn(true);
                setUserId(id);
                setMessage("로그인 성공");
                navigate("/LoadPage");
            } else {
                setIsLoggedIn(false);
                setMessage("로그인 실패");
            }
        } catch (error) {
            console.error(error);
            setIsLoggedIn(false);
            setMessage("서버 연결 실패");
        }
    };

    return (
        <Layout>
            <h1>로그인 페이지</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "200px" }}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                />
                <button onClick={handleLogin}>로그인</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100px", marginTop: "10px" }}>
                <button onClick={() => (window.location.href = "/register")}>회원가입</button>
            </div>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </Layout>
    );
}

export default Login;
