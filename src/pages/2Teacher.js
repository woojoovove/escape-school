import React, { memo, useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

function Teacher() {
    const { addItem, removeItem } = useGame();

    // 메모 숫자 설정
    const memoBoard = 7;
    const memoDesk = 11;
    const memoLocker = 6;
    const correctAnswer = memoBoard + memoDesk + memoLocker;

    // 상태
    const [pickedBoard, setPickedBoard] = useState(false);
    const [pickedDesk, setPickedDesk] = useState(false);
    const [pickedLocker, setPickedLocker] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [answer, setAnswer] = useState("");

    // 사물함 구성: 3개 중 하나는 메모, 하나는 자물쇠, 하나는 빈칸
    const memoIndex = 0; // 메모 있는 사물함
    const lockIndex = 2; // 자물쇠 있는 사물함

    const handleBoardClick = () => {
        if (pickedBoard) return;
        setPickedBoard(true);
        addItem(`메모(${memoBoard})`);
    };

    const handleDeskClick = () => {
        if (pickedDesk) return;
        setPickedDesk(true);
        addItem(`메모(${memoDesk})`);
    };

    const handleLockerClick = (idx) => {
        if (idx === memoIndex) {
            if (pickedLocker) return;
            setPickedLocker(true);
            addItem(`메모(${memoLocker})`);
            return;
        }
        if (idx === lockIndex) {
            setShowModal(true);
            return;
        }
    };

    const submitAnswer = () => {
        const n = parseInt(answer.trim(), 10);
        if (!Number.isFinite(n)) {
            alert("숫자를 입력하세요.");
            return;
        }
        if (n === correctAnswer) {
            alert("정답입니다! 과학실 열쇠를 얻었습니다.");
            addItem("과학실 열쇠");
            // 메모 3개는 사용되었으므로 삭제
            removeItem(`메모(${memoLocker})`);
            removeItem(`메모(${memoBoard})`);
            removeItem(`메모(${memoDesk})`);
            setShowModal(false);
            setAnswer("");
        } else {
            alert("정답이 아닙니다.");
        }
    };

    return (
        <Layout nextPath="/3Science">
            <h1 style={{ marginBottom: 16 }}>교무실</h1>

            <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 1000 }}>
                {/* 왼쪽: 사물함 (1 x 3) */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {Array.from({ length: 3 }).map((_, idx) => {
                        const isMemo = idx === memoIndex;
                        const isLock = idx === lockIndex;
                        const opened = isMemo && pickedLocker;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleLockerClick(idx)}
                                style={{
                                    height: 100,
                                    border: "2px solid #888",
                                    background: "#f3d17a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    userSelect: "none",
                                    fontWeight: 700,
                                }}
                                title={isMemo ? null : isLock ? "자물쇠가 있습니다" : null}
                            >
                                {/* 메모 사물함: 📒 아이콘 작게 표시 (숫자는 가림) */}
                                {isMemo && !opened ? (
                                    <span style={{ position: "absolute", right: 10, bottom: 8, fontSize: 18, opacity: 0.85 }}>
                                        📒
                                    </span>
                                ) : null}
                                {isLock ? "🔒" : opened ? null : !isMemo ? null : null}
                            </div>
                        );
                    })}
                </div>

                {/* 오른쪽: 칠판(상단) + 책상(하단) */}
                <div style={{ flex: 1.4, display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* 칠판 */}
                    <div
                        onClick={handleBoardClick}
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
                            cursor: pickedBoard ? "default" : "pointer",
                        }}
                    >
                        <span style={{ opacity: 0.9 }}>칠판</span>
                        {!pickedBoard && (
                            <span style={{ position: "absolute", right: 12, bottom: 10, fontSize: 18, opacity: 0.85 }}>📒</span>
                        )}
                    </div>

                    {/* 책상 */}
                    <div
                        onClick={handleDeskClick}
                        style={{
                            flex: 1,
                            minHeight: 140,
                            background: "#c6a26b",
                            borderRadius: 8,
                            border: "2px solid #8b6b3f",
                            color: "#222",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            cursor: pickedDesk ? "default" : "pointer",
                        }}
                    >
                        <span style={{ opacity: 0.9 }}>책상</span>
                        {!pickedDesk && (
                            <span style={{ position: "absolute", right: 12, bottom: 10, fontSize: 18, opacity: 0.85 }}>📒</span>
                        )}
                    </div>
                </div>
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
                            width: 340,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <input
                            type="text"
                            inputMode="numeric"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="비밀번호를 입력하세요."
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

export default Teacher;
