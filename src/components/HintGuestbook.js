import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";

function HintGuestbook() {
    const { roomNumber } = useGame();
    const [open, setOpen] = useState(false);
    const [hints, setHints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const url = `http://localhost:8080/get_hint?place=${encodeURIComponent(roomNumber)}`;
                const res = await fetch(url, { method: "GET" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = (await res.text()).trim();
                // 서버 응답에서 마지막 JSON 배열을 우선 파싱
                const jsonStart = text.lastIndexOf("[");
                const jsonEnd = text.lastIndexOf("]");
                let list = [];
                if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                    try { list = JSON.parse(text.slice(jsonStart, jsonEnd + 1)); } catch (_) { list = []; }
                }
                // JSON이 비었으면 'id:hint' 형태의 스트림을 보조 파싱
                if ((!list || list.length === 0) && text) {
                    const pairs = Array.from(text.matchAll(/([^:\n\r\[]+):([^\n\r\[]+)/g)).map(m => ({ id: m[1].trim(), hint: m[2].trim() }));
                    if (pairs.length) list = pairs.map((p, i) => ({ id: p.id, room_id: roomNumber, hint: p.hint, hint_id: i }));
                }
                if (!cancelled) setHints(Array.isArray(list) ? list : []);
            } catch (e) {
                if (!cancelled) setError("힌트를 불러오지 못했습니다.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [open, roomNumber]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="방명록"
                title="방명록"
                style={{
                    position: "fixed",
                    top: 12,
                    right: 12,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    zIndex: 600,
                }}
            >
                📔 방명록
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: "white", width: 420, maxWidth: "90%", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0 }}>현재 방 힌트</h3>
                            <button onClick={() => setOpen(false)}>닫기</button>
                        </div>
                        {loading ? (
                            <div>불러오는 중…</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : hints.length === 0 ? (
                            <div>등록된 힌트가 없습니다.</div>
                        ) : (
                            hints.map((h, i) => (
                                <div key={i} style={{ padding: "8px 10px", border: "1px solid #eee", borderRadius: 6 }}>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>작성자: {h.id ?? "익명"} · 방: {h.room_id}</div>
                                    <div style={{ marginTop: 4 }}>{h.hint}</div>
                                </div>
                            ))
                        )}
                        <div style={{ fontSize: 12, color: "#666" }}>
                            과학실(3번)은 최대 4개 표시 요구가 있으나, 서버 제한(3개) 시 최대 3개만 표시됩니다.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HintGuestbook;
