import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Inventory from "./Inventory";
import NextButton from "./NextButton";

function Layout({ children, nextPath }) {
    const location = useLocation();
    const { items, roomNumber, setRoomNumber } = useGame();

    const hiddenOn = new Set(["/", "/register", "/LoadPage", "/5Ending", "/4Exit"]);
    const isHidden = hiddenOn.has(location.pathname);

    // URL에서 방 번호를 읽어 자동 설정 (로그인/로딩/엔딩 제외)
    useEffect(() => {
        if (isHidden) return;
        const m = location.pathname.match(/\d+/);
        const num = m ? parseInt(m[0], 10) : roomNumber;
        if (!Number.isNaN(num) && num !== roomNumber) {
            setRoomNumber(num);
        }
    }, [location.pathname, roomNumber, setRoomNumber, isHidden]);

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: 60,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 1100, margin: "0 auto", padding: 16 }}>
                {!isHidden && <h2 style={{ alignSelf: "flex-start", marginBottom: 12 }}>현재 방 번호: {roomNumber}</h2>}
                {children}
                {nextPath && <NextButton nextPath={nextPath} />}
            </div>

            {!isHidden && <Inventory items={items} />}
        </div>
    );
}

export default Layout;
