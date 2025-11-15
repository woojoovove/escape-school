import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import doorImg from "../img/house_locked.jpg";
import React from "react";
import { useNavigate } from "react-router-dom";

function Exit() {
    const { items, finalizePlayTime, userId } = useGame();
    const navigate = useNavigate();

    const hasAxe = items.includes("도끼");

    const checkAxe = async () => {
        if (!hasAxe) {
            alert("도끼가 필요합니다!");
            return;
        }

        alert("도끼로 문을 부쉈습니다!");
        try {
            if (userId) {
                await finalizePlayTime(userId, { forceSave: true });
            }
        } catch (error) {
            console.error("Failed to save play time before ending:", error);
        } finally {
            navigate("/5Ending", { replace: true });
        }
    };

    return (
        <Layout nextPath="/5Ending">
            <img src={doorImg} onClick={checkAxe} alt="Exit Door" />
        </Layout>
    );
}

export default Exit;