// src/components/Inventory.js
import classroomKey from "../img/classroom_key.png";

const iconMap = {
    "교실 열쇠": classroomKey,
};

function Inventory({ items }) {
    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#222",
                color: "white",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "15px",
            }}
        >
            {items.length === 0 ? (
                <span>인벤토리가 비어있습니다.</span>
            ) : (
                items.map((item, i) => {
                    const icon = iconMap[item];
                    return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {icon ? <img src={icon} alt={item} width={24} height={24} /> : null}
                            <span>{item}</span>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Inventory;

