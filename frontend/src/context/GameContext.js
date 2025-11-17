// src/context/GameContext.js
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    // 인벤토리 상태 (서버에서 복원)
    const [items, setItems] = useState([]);
    const [roomNumber, setRoomNumber] = useState(1);
    const PLAY_START_KEY = "playStartTime";
    const PLAY_SECONDS_KEY = "playSeconds";
    const PLAY_SAVED_KEY = "playTimeSaved";

    // 로그인 상태(localStorage 유지)와 사용자 ID(메모리만)
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        try {
            return localStorage.getItem("isLoggedIn") === "true";
        } catch (_) {
            return false;
        }
    });
    const [userId, setUserId] = useState(() => {
        try {
            return localStorage.getItem("userId") || "";
        } catch (_) {
            return "";
        }
    });
    const [playStartTime, setPlayStartTime] = useState(() => {
        try {
            const stored = localStorage.getItem(PLAY_START_KEY);
            return stored ? Number(stored) : null;
        } catch (_) {
            return null;
        }
    });
    const [playSeconds, setPlaySeconds] = useState(() => {
        try {
            const stored = localStorage.getItem(PLAY_SECONDS_KEY);
            return stored ? Number(stored) : 0;
        } catch (_) {
            return 0;
        }
    });
    const [isSavingTime, setIsSavingTime] = useState(false);
    const [playTimeSaved, setPlayTimeSaved] = useState(() => {
        try {
            return localStorage.getItem(PLAY_SAVED_KEY) === "true";
        } catch (_) {
            return false;
        }
    });

    const formatSecondsToClock = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");
        const minutes = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
        return `${hours}:${minutes}:${secs}`;
    }, []);

    // 슬롯 상태
    const [saveNumber, setSaveNumber] = useState(1);

    useEffect(() => {
        try {
            localStorage.setItem("isLoggedIn", String(isLoggedIn));
        } catch (_) {}
    }, [isLoggedIn]);

    useEffect(() => {
        try {
            if (userId) {
                localStorage.setItem("userId", userId);
            } else {
                localStorage.removeItem("userId");
            }
        } catch (_) {}
    }, [userId]);

    useEffect(() => {
        try {
            if (playStartTime) {
                localStorage.setItem(PLAY_START_KEY, String(playStartTime));
            } else {
                localStorage.removeItem(PLAY_START_KEY);
            }
        } catch (_) {}
    }, [playStartTime]);

    useEffect(() => {
        try {
            localStorage.setItem(PLAY_SECONDS_KEY, String(playSeconds));
        } catch (_) {}
    }, [playSeconds]);

    useEffect(() => {
        try {
            if (playTimeSaved) {
                localStorage.setItem(PLAY_SAVED_KEY, "true");
            } else {
                localStorage.removeItem(PLAY_SAVED_KEY);
            }
        } catch (_) {}
    }, [playTimeSaved]);

    const recomputeSeconds = useCallback(() => {
        if (!playStartTime) return;
        const now = Date.now();
        const elapsed = Math.max(0, Math.floor((now - playStartTime) / 1000));
        setPlaySeconds(elapsed);
    }, [playStartTime]);

    useEffect(() => {
        if (!playStartTime) return;
        recomputeSeconds();
        const interval = setInterval(recomputeSeconds, 1000);
        return () => clearInterval(interval);
    }, [playStartTime, recomputeSeconds]);

    const startPlayTimer = useCallback(() => {
        const now = Date.now();
        setPlayStartTime(now);
        setPlaySeconds(0);
        setPlayTimeSaved(false);
    }, []);

    const stopPlayTimer = useCallback(() => {
        setPlayStartTime(null);
    }, []);

    const finalizePlayTime = useCallback(
        async (id, options = {}) => {
            if (isSavingTime) return playSeconds;
            if (playTimeSaved && !options?.forceSave) {
                return playSeconds;
            }
            const totalSeconds = playStartTime
                ? Math.max(0, Math.floor((Date.now() - playStartTime) / 1000))
                : playSeconds;
            setPlaySeconds(totalSeconds);
            setPlayStartTime(null);

            if (!id) {
                return totalSeconds;
            }

            const formatted = formatSecondsToClock(totalSeconds);
            setIsSavingTime(true);
            try {
                const url = `http://localhost:8080/save_time?id=${encodeURIComponent(
                    id
                )}&time=${encodeURIComponent(formatted)}`;
                await fetch(url, { method: "GET" });
                setPlayTimeSaved(true);
            } catch (error) {
                console.error("Failed to save total playtime:", error);
                setPlayTimeSaved(false);
                throw error;
            } finally {
                setIsSavingTime(false);
            }

            return totalSeconds;
        },
        [playStartTime, playSeconds, isSavingTime, formatSecondsToClock, playTimeSaved]
    );

    // 서버 코드 매핑 (표시 이름 -> 서버 아이템 코드)
    const serverCodeMap = {
        "교실 열쇠": "key_office",
        "교무실 열쇠": "key_office",
        "과학실 열쇠": "key_science_room",
        "도끼": "axe",
        "마스터 키": "master_key",
        "메모(사물함)": "memo_locker",
        "메모(화이트보드)": "memo_whiteboard",
        "메모(서랍)": "memo_Drawer",
    };

    // 서버 코드 -> 표시 이름 역매핑
    const codeToDisplay = Object.fromEntries(
        Object.entries(serverCodeMap).map(([k, v]) => [v, k])
    );

    // 서버에서 인벤토리 새로고침
    const refreshInventory = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/call_inventory", { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = (await res.text()) || ""; // 예: {'key_office', 'memo_locker'} 또는 'set()'
            const knownCodes = new Set(Object.values(serverCodeMap));
            const codes = Array.from(text.matchAll(/[a-zA-Z_]+/g))
                .map((m) => m[0])
                .filter((c) => knownCodes.has(c));
            const displayItems = codes
                .map((c) => codeToDisplay[c])
                .filter((v, i, a) => a.indexOf(v) === i);
            setItems(displayItems);
        } catch (_) {
            setItems([]);
        }
    }, []);

    // 마운트 시 서버 인벤토리 불러오기
    useEffect(() => {
        refreshInventory();
    }, [refreshInventory]);

    // 인벤토리 조작 함수들
    const addItem = async (item) => {
        const code = serverCodeMap[item] || item;
        try {
            await fetch(
                `http://localhost:8080/save_item?item=${encodeURIComponent(code)}`,
                { method: "GET" }
            );
        } catch (e) {
            console.error("Failed to sync item to server:", e);
        } finally {
            setItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
        }
    };
    const removeItem = (item) => setItems((prev) => prev.filter((i) => i !== item));
    const clearItems = () => setItems([]);

    // 이동
    const moveToNextRoom = () => setRoomNumber((prev) => prev + 1);
    const resetRoom = () => setRoomNumber(1);

    return (
        <GameContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                clearItems,
                roomNumber,
                setRoomNumber,
                setSaveNumber,
                saveNumber,
                moveToNextRoom,
                resetRoom,
                isLoggedIn,
                setIsLoggedIn,
                userId,
                setUserId,
                refreshInventory,
                playSeconds,
                playStartTime,
                startPlayTimer,
                stopPlayTimer,
                finalizePlayTime,
                playTimeSaved,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
