import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Register() {
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!id || !pwd) {
            setMessage("아이디와 비밀번호를 입력하세요");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, pwd }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const text = (await response.text()).trim();
            if (text.includes("성공")) {
                setMessage("회원가입 성공");
                navigate("/1Class");
            } else {
                setMessage("회원가입 실패");
            }
        } catch (error) {
            console.error(error);
            setMessage("서버 연결 실패");
        }
    };

    return (
        <Layout nextPath="/">
            <h1>회원가입 페이지</h1>
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
                <button onClick={handleRegister}>회원가입</button>
            </div>

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </Layout>
    );
}

export default Register;
