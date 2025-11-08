import { useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Class() {
    const { addItem } = useGame();
    const [showModal, setShowModal] = useState(false);
    const [answer, setAnswer] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);

    const rows = 3;
    const cols = 6;
    const lockIndex = 8; // 자물쇠 위치(0-based)

    const handleLockerClick = (idx) => {
        if (idx === lockIndex) {
            if (isUnlocked) return; 
            setShowModal(true);
        }
    };

    const submitAnswer = () => {
        if (answer.trim() === "14") {
            setIsUnlocked(true);
            addItem("교실 열쇠");
            setShowModal(false);
            setAnswer("");
        } else {
            alert("정답이 아닙니다.");
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
                게시판 7 × 2 = ?
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
                            <button onClick={submitAnswer}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Class;
