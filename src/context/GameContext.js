// src/context/GameContext.js
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    // 인벤토리 상태 (서버에서 복원)
    const [items, setItems] = useState([]);
    const [roomNumber, setRoomNumber] = useState(1);

    // 로그인 상태(localStorage 유지)와 사용자 ID(메모리만)
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        try {
            return localStorage.getItem("isLoggedIn") === "true";
        } catch (_) {
            return false;
        }
    });
    const [userId, setUserId] = useState("");

    // 슬롯 상태
    const [saveNumber, setSaveNumber] = useState(1);

    useEffect(() => {
        try {
            localStorage.setItem("isLoggedIn", String(isLoggedIn));
        } catch (_) {}
    }, [isLoggedIn]);

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
                moveToNextRoom,
                resetRoom,
                isLoggedIn,
                setIsLoggedIn,
                userId,
                setUserId,
                refreshInventory,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
