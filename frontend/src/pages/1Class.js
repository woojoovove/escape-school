import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import ghostImg from "../img/ghost.jpg";

function Class() {
    const { addItem } = useGame();
    const [showModal, setShowModal] = useState(false);
    const [answer, setAnswer] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [quiz, setQuiz] = useState("");
    const [quizLoading, setQuizLoading] = useState(true);
    const [quizError, setQuizError] = useState("");
    const [showGhost, setShowGhost] = useState(false);
    const ghostTimerRef = useRef(null);

    const rows = 3;
    const cols = 6;
    const lockIndex = 8; // 자물쇠 위치(0-based)

    const handleLockerClick = (idx) => {
        if (idx === lockIndex) {
            if (isUnlocked) return; 
            setShowModal(true);
        }
    };

    useEffect(() => {
        let aborted = false;
        const fetchQuiz = async () => {
            try {
                setQuizLoading(true);
                setQuizError("");
                const res = await fetch("http://backend:8080/make_quiz_class", { method: "GET" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = (await res.text()).trim();
                if (!aborted) setQuiz(text);
            } catch (e) {
                console.error(e);
                if (!aborted) {
                    setQuiz("");
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

    const maybeShowGhost = () => {

        if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);

        setShowGhost(true);

        ghostTimerRef.current = setTimeout(() => {
            setShowGhost(false);
            alert("오답입니다. 다시 시도해주세요.");
        },
         1500);
        // if (Math.random() <= 0.3) {


        // } else{
        //         alert("오답입니다. 다시 시도해주세요.");
        // }
    };



    useEffect(() => {

        return () => {

            if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);

        };

    }, []);



    const submitAnswer = async () => {
        if (submitting) return;
        const trimmed = answer.trim();
        if (!trimmed) {
            alert("답안을 입력해주세요.");
            return;
        }
        try {
            setSubmitting(true);
            const url = `http://backend:8080/quiz_class?class_answer=${encodeURIComponent(trimmed)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = (await res.text()).trim();
            if (text.includes("정답")) {
                setIsUnlocked(true);
                addItem("교실 열쇠");
                setShowModal(false);
                setAnswer("");
            } else {
                maybeShowGhost();
                
            }
        } catch (e) {
            console.error(e);
            alert("통신 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout nextPath="/2Teacher">
            {/* 상단 게시판 중앙 정렬 */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 900,
                    height: 160,
                    margin: "0 auto 24px",
                    padding: 16,
                    background: "#004209ff",
                    border: "2px solid #ccc",
                    borderRadius: 8,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 24,
                    fontWeight: 700,
                }}
            >
                {quizLoading
                    ? "문제를 불러오는 중..."
                    : quizError
                    ? quizError
                    : `교실에서 찾은 쪽지에는 ${quiz.split("").join(" ")} 라고 적혀 있다.`
                }
            </div>

            {/* 사물함 6 x 3 */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 12,
                    width: "100%",
                    maxWidth: 900,
                    margin: "0 auto",
                }}
            >
                {Array.from({ length: rows * cols }).map((_, idx) => {
                    const hasLock = idx === lockIndex;
                    const opened = hasLock && isUnlocked;
                    return (
                        <div
                            key={idx}
                            onClick={() => handleLockerClick(idx)}
                            style={{
                                height: 80,
                                border: "2px solid #888",
                                borderRadius: 0,
                                background: opened ? "#d1ffd6" : "#ffb62fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: hasLock && !opened ? "pointer" : "default",
                                userSelect: "none",
                                color: opened ? "#006400" : "#333",
                                position: "relative",
                            }}
                            title={hasLock ? (opened ? "열림" : "사물함에 자물쇠가 있습니다") : "비어있는 사물함"}
                        >
                            {hasLock ? (opened ? "열림" : "🔒") : idx + 1}
                        </div>
                    );
                })}
            </div>

            {/* 정답 입력 모달 */}
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
                            width: 320,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="비밀번호 입력"
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
            {showGhost && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.65)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                    }}
                >
                    <img src={ghostImg} alt="Ghost" style={{ maxWidth: "60%", maxHeight: "60%", objectFit: "contain" }} />
                </div>
            )}
        </Layout>
    );
}

export default Class;
