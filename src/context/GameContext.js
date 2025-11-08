// src/context/GameContext.js
import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
    // 🔸 전역 상태들
    const [items, setItems] = useState([]);
    const [roomNumber, setRoomNumber] = useState(1);
    // 로그인 여부
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 🔹 인벤토리 조작 함수
    const addItem = (item) => setItems((prev) => [...prev, item]);
    const removeItem = (item) => setItems((prev) => prev.filter((i) => i !== item));
    const clearItems = () => setItems([]);

    // 🔹 방 이동 함수
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
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
