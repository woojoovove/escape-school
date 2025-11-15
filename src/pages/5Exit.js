import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import doorImg from '../img/house_locked.jpg';
import React from "react";

function Exit() {
    const { items } = useGame();

    const hasAxe = items.includes("도끼");
    const checkAxe = () => {
        if (hasAxe) {
            window.location.href = "/6Ending"
        } else {
            alert("도끼가 필요합니다.")
        }
    }
    return (
        <Layout nextPath="/6Ending">
            <img src={doorImg} onClick={checkAxe}></img>
        </Layout>
    );
}

export default Exit;
