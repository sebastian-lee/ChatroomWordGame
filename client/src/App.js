import React, { Component } from "react";
import io from "socket.io-client";

import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import Chatroom from "./components/Chatroom/Chatroom";
import RoomList from "./components/RoomList/RoomList";

const socket = io();

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={props => <RoomList {...props} socket={socket} />}
            />
            <Route
              path="/room/:roomName"
              render={props => <Chatroom {...props} socket={socket} />}
            />
            <Route
              render={function() {
                return <p>Not Found</p>;
              }}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
