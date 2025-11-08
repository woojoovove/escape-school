import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Inventory from "./Inventory";
import NextButton from "./NextButton";

function Layout({ children, nextPath }) {
    const location = useLocation();
    const { items, roomNumber, setRoomNumber } = useGame();

    useEffect(() => {
        const m = location.pathname.match(/\d+/);
        const num = m ? parseInt(m[0], 10) : roomNumber;
        if (!Number.isNaN(num) && num !== roomNumber) {
            setRoomNumber(num);
        }
    }, [location.pathname, roomNumber, setRoomNumber]);

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h2>현재 방 번호: {roomNumber}</h2>
            {children}

            {nextPath && <NextButton nextPath={nextPath} />}

            <Inventory items={items} />
        </div>
    );
}

export default Layout;
