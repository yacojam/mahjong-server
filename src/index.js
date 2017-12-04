import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import io from "socket.io-client";
import Login from "./Login";
import Admax from "./admax/app";
import { getSearchString } from "./utils";

const startGame = getSearchString("startgame");

if (startGame && window.uid) {
  const socket = new io(":8080");
  socket.on("data", data => {
    console.log(data);
  });
  window.socket = socket;
}

const Index = () => {
  if (startGame) {
    if (window.uid) {
      return <App />;
    } else {
      return <Login />;
    }
  }
  return <Admax />;
};

ReactDOM.render(<Index />, document.getElementById("root"));
registerServiceWorker();
