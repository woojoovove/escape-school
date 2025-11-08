// src/context/GameContext.js
import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
    // 인벤토리 상태
    const [items, setItems] = useState([]);
    const [roomNumber, setRoomNumber] = useState(1);
    // 로그인 상태 및 사용자 ID (localStorage 연동)
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

    useEffect(() => {
        try {
            localStorage.setItem("isLoggedIn", String(isLoggedIn));
        } catch (_) {}
    }, [isLoggedIn]);

    useEffect(() => {
        try {
            if (userId) localStorage.setItem("userId", userId);
            else localStorage.removeItem("userId");
        } catch (_) {}
    }, [userId]);

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
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
