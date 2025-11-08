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

    // 인벤토리 조작 함수들
    const addItem = (item) => setItems((prev) => [...prev, item]);
    const removeItem = (item) => setItems((prev) => prev.filter((i) => i !== item));
    const clearItems = () => setItems([]);

    // 방 이동
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
