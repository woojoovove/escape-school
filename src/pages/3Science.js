import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import fibonacciImg from '../img/fibonacci.png';
import scienceImg from '../img/science.jpg';
import fibonacciImg from "../img/fibonacci.png";

import ghostImg from "../img/ghost.jpg";

function Science() {
    const { addItem, items } = useGame();

    // 상태: 마스터키/도끼 획득 여부
    const hasMaster = items.includes("마스터 키");
    const hasAxe = items.includes("도끼");
    const [tookAxe, setTookAxe] = useState(false);

    // 우측 큰 장식장: 1x3 중 가운데(인덱스 1)가 퍼즐 장식장
    const puzzleCabinetIndex = 1;

    // 퍼즐(5x2 키패드) 상태
    const keypadNumbers = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
    const correctSeq = [4, 1, 8, 1];
    const [showKeypad, setShowKeypad] = useState(false);
    const [inputSeq, setInputSeq] = useState([]);
    const [solved, setSolved] = useState(hasMaster);
    const [showGhost, setShowGhost] = useState(false);
    const ghostTimerRef = useRef(null);

    const [quizLoading, setQuizLoading] = useState(true);
    const [quizText, setQuizText] = useState("")

    const handleGlassCaseClick = () => {
        if (hasAxe || tookAxe) return;
        if (!hasMaster) {
            alert("마스터 키가 필요합니다.");
            return;
        }
        setTookAxe(true);
        addItem("도끼");
        alert("도끼를 얻었습니다.");
    };

    const handleCabinetClick = (idx) => {
        if (idx !== puzzleCabinetIndex) return;
        if (solved) return; // 이미 해결됨
        setShowKeypad(true);
        setInputSeq([]);
    };

    const pressNumber = (n) => {
    if (solved) return;
    setInputSeq(prev => [...prev, n]);
    };

    const handleSubmit = () => {
        const answer = inputSeq.join(""); // "4181" 같은 문자열
        checkScienceAnswer(answer);
    };


    const maybeShowGhost = () => {

        if (Math.random() <= 0.3) {

            if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);

            setShowGhost(true);

            ghostTimerRef.current = setTimeout(() => {
                setShowGhost(false)
                alert("틀렸습니다. 다시 시도해 보세요.");
            },
            1500);

        } else{
            alert("틀렸습니다. 다시 시도해 보세요.");
        }

    };



    const checkScienceAnswer = async (answer) => {
        try {
            const url = `http://localhost:8080/quiz_science?science_answer=${encodeURIComponent(answer)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = (await res.text()).trim();

            if (text === "정답") {
                alert("정답입니다! 마스터 키를 획득했습니다.");
                addItem("마스터 키");
                setShowKeypad(false);
            } else if (text === "실패") {
                maybeShowGhost();
            } else {
                maybeShowGhost();
            }

            return text;
        } catch (e) {
            console.error(e);
            alert("네트워크 오류가 발생했습니다.");
            maybeShowGhost();
            return null;
        }
    };


    useEffect(() => {
        let aborted = false;
        const fetchQuiz = async () => {
            try {
                setQuizLoading(true);
                const res = await fetch("http://localhost:8080/make_quiz_science", {method: "GET"});
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = (await res.text()).trim();
                if (!aborted) setQuizText(text);
            } catch (e) {
                console.error(e);

            } finally {
                if (!aborted) setQuizLoading(false);
            }
        };
        fetchQuiz();
        return () => {
            aborted = true;
        };
    }, []);

    return (
        <Layout nextPath="/4Exit">
            <h1 style={{ marginBottom: 16 }}>과학실</h1>

            <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 1100 }}>
                {/* 왼쪽: 유리 장식장(상단) + 과학 실험 책상(하단) */}
                <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* 유리 장식장 */}
                    <div
                        onClick={handleGlassCaseClick}
                        style={{
                            flex: 1,
                            minHeight: 140,
                            borderRadius: 10,
                            border: "2px solid #88bcd7",
                            background: "linear-gradient(180deg, rgba(200,230,245,0.8), rgba(180,210,230,0.6))",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: hasAxe || tookAxe ? "default" : "pointer",
                        }}
                        title={hasMaster ? (hasAxe || tookAxe ? "도끼 획득 완료" : "클릭해서 도끼 획득") : "마스터 키 필요"}
                    >
                        <span style={{ fontWeight: 700, color: "#0e3a5a" }}>유리 장식장</span>
                        {/* 장식장 내부 아이콘 힌트 */}
                        <span style={{ position: "absolute", right: 12, bottom: 10, fontSize: 18, opacity: 0.85 }}>??</span>
                    </div>

                    {/* 과학 실험중 책상 */}
                    <div
                        style={{
                            flex: 1,
                            minHeight: 140,
                            borderRadius: 10,
                            border: "2px solid #8b6b3f",
                            background: "#cda879",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#241a10",
                            overflow: "hidden",
                        }}
                    >
                        <img src={scienceImg} style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover", // div를 꽉 채우면서 비율 유지
                        }}></img>
                    </div>
                </div>

                {/* 오른쪽: 1 x 3 큰 장식장 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {Array.from({ length: 3 }).map((_, idx) => {
                        const isPuzzle = idx === puzzleCabinetIndex;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleCabinetClick(idx)}
                                style={{
                                    height: 110,
                                    border: "2px solid #777",
                                    borderRadius: 6,
                                    background: isPuzzle ? (solved ? "#d1ffd6" : "#ffe9a8") : "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: isPuzzle && !solved ? "pointer" : "default",
                                    position: "relative",
                                }}
                                title={isPuzzle ? (solved ? "퍼즐 해결" : "클릭하여 퍼즐 시작") : "장식장"}
                            >

                                {idx === 0 && (
                                    <span>{quizText}</span>
                                )}

                                {idx === 1 && (solved ? "퍼즐 해결됨" : "퍼즐 장식장")}
                                {idx === 2 && <img src={fibonacciImg} height={80} ></img>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 5 x 2 키패드 모달 */}
            {showKeypad && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowKeypad(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 10,
                            width: 360,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <div style={{ fontWeight: 700 }}>정답 숫자들을 순서대로 누르세요.</div>
                        <div style={{ minHeight: 24, opacity: 0.8 }}>입력: {inputSeq.join(" ")}</div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                gap: 8,
                            }}
                        >
                            {keypadNumbers.map((n) => (
                                <button key={n} onClick={() => pressNumber(n)} style={{ padding: "10px 0", fontSize: 16 }}>
                                    {n}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={() => setInputSeq([])}>지우기</button>
                            <button onClick={handleSubmit} style={{ background: "#4caf50", color: "white", padding: "6px 12px", borderRadius: 4 }}>
        제출
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

export default Science;

