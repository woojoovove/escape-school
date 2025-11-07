import { useGame } from "../context/GameContext";
import Inventory from "./Inventory";
import NextButton from "./NextButton";

function Layout({ children, nextPath }) {
    const { items, roomNumber } = useGame();

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
