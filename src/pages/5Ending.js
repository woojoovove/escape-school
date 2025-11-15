import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";

function Ending() {
    const { finalizePlayTime, userId, playSeconds, playTimeSaved } = useGame();
    const [submittedSeconds, setSubmittedSeconds] = useState(playSeconds);
    const [statusMessage, setStatusMessage] = useState("");
    const [rankingEntries, setRankingEntries] = useState([]);
    const [isRankingLoading, setIsRankingLoading] = useState(false);
    const [rankingError, setRankingError] = useState("");
    const hasSavedTime = useRef(false);

    const fetchRanking = useCallback(async () => {
        setIsRankingLoading(true);
        setRankingError("");
        try {
            const res = await fetch("http://127.0.0.1:8080/get_ranking");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            let parsed;
            try {
                parsed = await res.json();
            } catch (_) {
                parsed = {};
            }
            if (!parsed || typeof parsed !== "object") {
                parsed = {};
            }
            const entries = Object.entries(parsed).map(([label, value]) => ({
                label,
                id: value && typeof value === "object" ? value.id ?? "" : "",
                time: value && typeof value === "object" ? value.time ?? "" : "",
            }));
            setRankingEntries(entries);
        } catch (error) {
            console.error("Failed to load ranking", error);
            setRankingError("랭킹을 불러오지 못했습니다.");
        } finally {
            setIsRankingLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    useEffect(() => {
        if (!userId || hasSavedTime.current || playTimeSaved) {
            if (playTimeSaved) {
                setStatusMessage("이미 저장된 플레이 타임입니다.");
            }
            return;
        }
        hasSavedTime.current = true;
        setStatusMessage("총 플레이 타임 저장 중...");
        finalizePlayTime(userId)
            .then((seconds) => {
                setSubmittedSeconds(seconds);
                setStatusMessage("총 플레이 타임을 저장했습니다.");
            })
            .catch(() => {
                setStatusMessage("플레이 타임 저장에 실패했습니다.");
            })
            .finally(() => {
                fetchRanking();
            });
    }, [finalizePlayTime, userId, fetchRanking, playTimeSaved]);

    const totalSeconds = submittedSeconds ?? playSeconds ?? 0;

    return (
        <div style={{ padding: 24, textAlign: "center" }}>
            <h1>탈출 성공</h1>
            <p>총 플레이 타임: {totalSeconds}초</p>
            {statusMessage && <p>{statusMessage}</p>}
            <section style={{ marginTop: 32 }}>
                <h2>랭킹</h2>
                {isRankingLoading && <p>랭킹을 불러오는 중...</p>}
                {rankingError && <p>{rankingError}</p>}
                {!isRankingLoading && !rankingError && rankingEntries.length === 0 && (
                    <p>랭킹 데이터가 없습니다.</p>
                )}
                {rankingEntries.length > 0 && (
                    <ol style={{ listStyle: "none", padding: 0, maxWidth: 360, margin: "0 auto" }}>
                        {rankingEntries.map(({ label, id, time }) => (
                            <li
                                key={label}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    textAlign: "left",
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                <span style={{ fontWeight: 600 }}>{label}</span>
                                <span>
                                    {id && <strong style={{ marginRight: 6 }}>{id}</strong>}
                                    <span>{time}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </div>
    );
}

export default Ending;
