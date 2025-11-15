import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";

const ROOM_ROUTE_BY_NUMBER = {
    0: "/1Class",
    1: "/1Class",
    2: "/2Teacher",
    3: "/3Science",
    4: "/5Exit",
};

const ROOM_ROUTE_BY_NAME = {
    class_room: "/1Class",
    classroom: "/1Class",
    office: "/2Teacher",
    teacher: "/2Teacher",
    science_room: "/3Science",
    science: "/3Science",
    exit: "/5Exit",
};

const KEYWORD_ROUTES = [
    { regex: /교실|class/i, path: "/1Class" },
    { regex: /교무실|office|teacher/i, path: "/2Teacher" },
    { regex: /과학|science/i, path: "/3Science" },
    { regex: /출구|exit/i, path: "/5Exit" },
];

const resolveDestination = (roomValue, fallbackText = "") => {
    if (roomValue != null && roomValue !== "") {
        const asNumber = Number(roomValue);
        if (!Number.isNaN(asNumber) && ROOM_ROUTE_BY_NUMBER[asNumber]) {
            return ROOM_ROUTE_BY_NUMBER[asNumber];
        }
        if (typeof roomValue === "string") {
            const normalized = roomValue.trim().toLowerCase();
            if (ROOM_ROUTE_BY_NAME[normalized]) {
                return ROOM_ROUTE_BY_NAME[normalized];
            }
        }
    }

    if (fallbackText) {
        for (const { regex, path } of KEYWORD_ROUTES) {
            if (regex.test(fallbackText)) {
                return path;
            }
        }
    }

    return null;
};

function LoadPage() {
    const { isLoggedIn, userId, refreshInventory } = useGame();
    const [message, setMessage] = useState("");
    const [loadingSlot, setLoadingSlot] = useState(null);
    const navigate = useNavigate();

    const handleLoad = async (slot) => {
        if (!isLoggedIn || !userId) {
            setMessage("로그인 후 이용해주세요");
            return;
        }

        try {
            setLoadingSlot(slot);
            const url = `http://localhost:8080/save_load?id=${encodeURIComponent(userId)}&save_slots=${encodeURIComponent(slot)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = (await res.text()).trim();

            let parsed;
            try {
                parsed = raw ? JSON.parse(raw) : null;
            } catch (_) {
                parsed = null;
            }

            const displayMessage =
                (typeof parsed?.message === "string" && parsed.message.trim()) ||
                raw ||
                "저장 데이터를 불러왔습니다";
            setMessage(displayMessage);

            await refreshInventory();

            let destination =
                parsed?.next_path ||
                resolveDestination(
                    parsed?.room ?? parsed?.room_num ?? parsed?.room_name ?? parsed?.destination,
                    displayMessage
                );

            if (!destination) {
                destination = resolveDestination(null, displayMessage);
            }

            if (destination) {
                navigate(destination);
            }
        } catch (e) {
            console.error(e);
            setMessage("불러오기 실패");
        } finally {
            setLoadingSlot(null);
        }
    };

    const renderButtonLabel = (slot, label) => (loadingSlot === slot ? "불러오는 중..." : label);

    return (
        <Layout>
            <h1>세이브 불러오기</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => handleLoad(1)} disabled={loadingSlot === 1}>
                    {renderButtonLabel(1, "세이브 1")}
                </button>
                <button onClick={() => handleLoad(2)} disabled={loadingSlot === 2}>
                    {renderButtonLabel(2, "세이브 2")}
                </button>
                <button onClick={() => handleLoad(3)} disabled={loadingSlot === 3}>
                    {renderButtonLabel(3, "세이브 3")}
                </button>
            </div>
            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </Layout>
    );
}

export default LoadPage;
