import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import React, {useState} from "react";
import ghostImg from '../img/ghost.jpg';

function Ghost() {
    const { addItem } = useGame();

    return (
        <Layout>
            <img src={ghostImg} onClick={() => (window.location.href = "/5Exit")}></img>
        </Layout>
    );
}

export default Ghost;
