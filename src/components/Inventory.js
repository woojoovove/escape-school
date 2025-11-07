// src/components/Inventory.js
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
                items.map((item, i) => <span key={i}>🎒 {item}</span>)
            )}
        </div>
    );
}

export default Inventory;
