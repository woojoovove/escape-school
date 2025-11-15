import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import doorImg from '../img/house_locked.jpg';
import React from "react";

function Exit() {
    const { items } = useGame();

    const hasAxe = items.includes("도끼");
    const checkAxe = () => {
        if (hasAxe) {
            alert("도끼로 문을 부숩니다.");
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
