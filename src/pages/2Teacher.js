import React, { memo, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Teacher() {
    const { addItem } = useGame();

    const [quizText, setQuizText] = useState("");
    const [quizLoading, setQuizLoading] = useState(true);
    const [quizError, setQuizError] = useState("");
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lockerUnlocked, setLockerUnlocked] = useState(false);

    const lockIndex = 2;

    useEffect(() => {
        let aborted = false;
        const fetchQuiz = async () => {
            try {
                setQuizLoading(true);
                setQuizError("");
                const res = await fetch("http://localhost:8080/make_quiz_office", { method: "GET" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = (await res.text()).trim();
                if (!aborted) setQuizText(text);
            } catch (e) {
                console.error(e);
                if (!aborted) {
                    setQuizText("");
                    setQuizError("문제를 불러오지 못했습니다.");
                }
            } finally {
                if (!aborted) setQuizLoading(false);
            }
        };
        fetchQuiz();
        return () => {
            aborted = true;
        };
    }, []);

    const openLock = () => {
        if (lockerUnlocked) {
            alert("이미 자물쇠를 열었습니다.");
            return;
        }
        if (quizLoading) {
            alert("문제를 불러오는 중입니다. 잠시만 기다려 주세요.");
            return;
        }
        if (quizError || !quizText) {
            alert("문제를 확인할 수 없습니다.");
            return;
        }
        setShowModal(true);
    };

    const submitAnswer = async () => {
        const trimmed = answer.trim();
        if (!trimmed) {
            alert("암호를 입력해주세요.");
            return;
        }
        if (submitting) return;
        try {
            setSubmitting(true);
            const url = `http://localhost:8080/quiz_office?office_answer=${encodeURIComponent(trimmed)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = (await res.text()).trim();
            if (text.includes("정답")) {
                alert("정답입니다! 과학실 열쇠를 획득했습니다.");
                addItem("과학실 열쇠");
                setLockerUnlocked(true);
                setShowModal(false);
                setAnswer("");
            } else {
                alert("정답이 아닙니다.");
            }
        } catch (e) {
            console.error(e);
            alert("통신 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout nextPath="/3Science">
            <h1 style={{ marginBottom: 16 }}>교무실</h1>

            <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 1000 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {Array.from({ length: 3 }).map((_, idx) => {
                        const isLock = idx === lockIndex;
                        const opened = isLock && lockerUnlocked;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (isLock) openLock();
                                }}
                                style={{
                                    height: 100,
                                    border: "2px solid #888",
                                    background: isLock ? (opened ? "#d1ffd6" : "#ffe4a1") : "#f3d17a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: isLock && !opened ? "pointer" : "default",
                                    position: "relative",
                                    fontWeight: 700,
                                    userSelect: "none",
                                }}
                                title={isLock ? (opened ? "열림" : "자물쇠를 열어보세요") : "비어있는 사물함"}
                            >
                                {isLock ? (opened ? "열림" : "🔒") : idx + 1}
                            </div>
                        );
                    })}
                </div>

                <div style={{ flex: 1.4, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div
                        style={{
                            flex: 1,
                            minHeight: 140,
                            background: "#174a3b",
                            borderRadius: 8,
                            border: "2px solid #0c2b22",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            padding: 16,
                            lineHeight: 1.4,
                            fontSize: 54
                        }}
                    >
                        {quizLoading
                            ? "칠판을 적는 중..."
                            : quizError
                            ? quizError
                            : `${quizText || "???"}`}
                    </div>

                    <div
                        style={{
                            flex: 1,
                            minHeight: 140,
                            background: "#c6a26b",
                            borderRadius: 8,
                            border: "2px solid #8b6b3f",
                            color: "#2b1a08",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 16,
                            textAlign: "center",
                        }}
                    >
                        
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 8,
                            width: 360,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <div style={{ lineHeight: 1.4 }}>
                            {quizText ? `비밀번호 입력.` : "문제를 찾을 수 없습니다."}
                        </div>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="암호를 입력해주세요."
                            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                        />
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowModal(false)}>취소</button>
                            <button onClick={submitAnswer} disabled={submitting}>
                                {submitting ? "확인중" : "확인"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default memo(Teacher);
