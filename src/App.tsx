import React, { useState } from "react";
import * as Colyseus from "colyseus.js";

import "./App.css";
import LeftBar from "./hud/leftBar/LeftBar";
import RightBar from "./hud/rightBar/RightBar";
import TopBar from "./hud/topBar/TopBar";
import BottomBar from "./hud/bottomBar/BottomBar";
import Game from "./core/Game";

export const colyseusClient = new Colyseus.Client("ws://localhost:2567");

// export let colyseusRoom: any;

// colyseusClient.joinOrCreate("ithan").then((room) => {
//   console.log(room);
// });

function App() {
  return (
    <div className="main-container">
      <TopBar />
      <LeftBar />
      <Game />
      <RightBar />
      <BottomBar />
    </div>
  );
}

export default App;
