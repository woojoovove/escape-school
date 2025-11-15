import React, { memo, useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import quiz13Img from "../img/13.jpg";
import quiz15Img from "../img/15.jpg";


function Teacher() {
    const { addItem } = useGame();

    const memoBoard = 7;
    const memoDesk = 11;
    const memoLocker = 6;

    const [quizText, setQuizText] = useState("");
    const [quizLoading, setQuizLoading] = useState(true);
    const [quizError, setQuizError] = useState("");
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lockerUnlocked, setLockerUnlocked] = useState(false);
    const [showMemoModal, setShowMemoModal] = useState(false);
    const [memoMessage, setMemoMessage] = useState("");

    const memoIndex = 0;
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

    const openMemo = (message) => {
        setMemoMessage(message);
        setShowMemoModal(true);
    };

    const handleBoardMemo = () => {
        openMemo(`눈이 1눈물이 6 `);
    };

    const handleDeskMemo = () => {
        openMemo(`입이 2 이빨이 4`);
    };

    const boardContent = useMemo(() => {
        if (quizLoading) return "칠판을 적는 중...";
        if (quizError) return quizError;
        const trimmed = (quizText || "").trim();
        const tokens = trimmed ? trimmed.split(/(\s+)/) : [];
        const renderImageToken = (src, alt, key) => (
            <span
                key={key}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, marginInline: 2 }}
            >
                {" "}
                <img src={src} alt={alt} style={{ maxHeight: 60 }} />
                {" "}
            </span>
        );
        if (!tokens.length) return "???";
        return (
            <>
                {tokens.map((token, idx) => {
                    const pure = token.trim();
                    if (!pure) {
                        return <React.Fragment key={`space-${idx}`}>{token}</React.Fragment>;
                    }
                    if (pure === "13") {
                        return renderImageToken(quiz13Img, "칠판 힌트 13", `img-13-${idx}`);
                    }
                    if (pure === "15") {
                        return renderImageToken(quiz15Img, "칠판 힌트 15", `img-15-${idx}`);
                    }
                    return <React.Fragment key={`text-${idx}`}>{token}</React.Fragment>;
                })}
            </>
        );
    }, [quizLoading, quizError, quizText]);

    return (
        <Layout nextPath="/3Science">
            <h1 style={{ marginBottom: 16 }}>교무실</h1>

            <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 1000 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {Array.from({ length: 3 }).map((_, idx) => {
                        const isMemo = idx === memoIndex;
                        const isLock = idx === lockIndex;
                        const opened = isLock && lockerUnlocked;
                        return (
                            <div
                                key={idx}
                                style={{
                                    height: 100,
                                    border: "2px solid #888",
                                    background: isLock ? (opened ? "#d1ffd6" : "#ffe4a1") : "#f3d17a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    fontWeight: 700,
                                    userSelect: "none",
                                }}
                            >
                                {isMemo && (
                                    <button
                                        onClick={() => openMemo(`코가5 눈동자 3`)}
                                        style={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 20,
                                        }}
                                        title="메모 확인"
                                    >
                                        📝
                                    </button>
                                )}
                                {isLock ? (
                                    <button
                                        onClick={openLock}
                                        disabled={opened}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            fontSize: 28,
                                            cursor: opened ? "default" : "pointer",
                                        }}
                                        title={opened ? "열림" : "자물쇠 열기"}
                                    >
                                        {opened ? "열림" : "🔒"}
                                    </button>
                                ) : (
                                    !isMemo && (
                                        <button
                                            onClick={handleBoardMemo}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 10,
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: 22,
                                            }}
                                            title="칠판 메모 보기"
                                        >
                                            📝
                                        </button>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{flex: 1.4, display: "flex", flexDirection: "column", gap: 16}}>
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
                            padding: 16,
                            lineHeight: 1.4,
                            fontSize: 32,
                            position: "relative",
                        }}
                    >
                        {boardContent}
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
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={handleDeskMemo}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 22,
                            }}
                            title="책상 메모 보기"
                        >
                            📝
                        </button>
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
                            {quizText ? null : "문제를 찾을 수 없습니다."}
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

            {showMemoModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 900,
                    }}
                    onClick={() => setShowMemoModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "white",
                            padding: 16,
                            borderRadius: 8,
                            width: 280,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <div>{memoMessage}</div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={() => setShowMemoModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default memo(Teacher);
