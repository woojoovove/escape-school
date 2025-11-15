import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import React, {useState} from "react";
import ghostImg from '../img/ghost.jpg';

function Ghost() {
    const { addItem } = useGame();

    return (
        <Layout nextPath="/5Exit">
            <img src={ghostImg}></img>
        </Layout>
    );
}

export default Ghost;
