import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useGame } from "../context/GameContext";

function NextButton({ nextPath }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, items, roomNumber, userId, saveNumber} = useGame();

    const [canProceed, setCanProceed] = useState(false);
    const [checking, setChecking] = useState(false);

    const hiddenOn = new Set(["/", "/register", "/LoadPage", "/5Ending", "/4Exit"]);
    const isHidden = hiddenOn.has(location.pathname);

    const checkComplete = useCallback(async () => {
        try {
            setChecking(true);
            const res = await fetch(`http://backend:8080/check_complete?room_num=${roomNumber}`, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = (await res.text()).trim();
            const ok = /true|1/i.test(text);
            setCanProceed(!!ok);
        } catch (e) {
            console.error(e);
            setCanProceed(false);
        } finally {
            setChecking(false);
        }
    }, [roomNumber]);

    useEffect(() => {
        if (!isHidden) {
            checkComplete();
        }
    }, [isHidden, location.pathname, items, checkComplete]);

    if (isHidden) return null;

    const gameSaveAndGo = () => {
        try {
            if (userId) {
                const url = `http://backend:8080/game_save?id=${encodeURIComponent(userId)}&save_slots=${encodeURIComponent(saveNumber)}&room_num=${encodeURIComponent(roomNumber)}`;
                fetch(url, { method: 'GET' });
            }
        } catch (e) {
            console.log(e);
        } finally {
            navigate(nextPath);
        }
    };


    return (
        <>
            <div
                style={{
                    position: "fixed",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    zIndex: 500,
                }}
            >
                <button
                    onClick={() => {
                        if (!isLoggedIn) {
                            alert("로그인 후 이용해주세요");
                            return;
                        }
                        if (!canProceed) {
                            alert("조건을 만족하지 않아 이동할 수 없습니다.");
                            return;
                        }
                        gameSaveAndGo();
                    }}
                    style={{
                        padding: "14px 18px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: canProceed ? "pointer" : "default",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        letterSpacing: 2,
                        opacity: canProceed ? 1 : 0.5,
                    }}
                    disabled={!canProceed || checking}
                >
                    {checking ? "확인중" : "다음으로"}
                </button>
            </div>
        </>
    );
}

export default NextButton;
