import React, { Component } from "react";
import io from "socket.io-client";
import styled from "styled-components";

//Import components
import Login from "./components/Login";
import MessageFeed from "./components/MessageFeed";
import UserList from "./components/UserList";
import Targets from "./components/Targets";
import SendMessagesBar from "./components/SendMessagesBar";

const socket = io();

//Basic Grid component
const Grid = styled.div`
  display: grid;
  grid-template: repeat(4, 1fr) 0.3fr / repeat(5, 20%);
  height: 100vh;
  border: 1px solid black;
`;

/*
 * Message Section
 */
const MessageSection = styled.div`
  grid-column: 1/5;
  grid-row: 1/5;
  border: 1px solid black;
`;

/*
 * Side Section
 */
const SideSection = styled.div`
  grid-column: 5/6;
  grid-row: 1/5;
  border: 1px solid black;

  display: grid;
  grid-template-row: 1fr 1fr;
`;

const UserListSection = styled.div`grid-row: 1;`;

const TargetSection = styled.div`grid-row: 2;`;

/*
 * Input Section
 */
const InputSection = styled.div`
  grid-column: 1/6;
  grid-row: 5/6;
  border: 1px solid black;
`;

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Login socket={socket} />
        <Grid>
          <MessageSection>
            <MessageFeed socket={socket} />
          </MessageSection>

          <SideSection>
            <UserListSection>
              <UserList socket={socket} />
            </UserListSection>

            <TargetSection>
              <Targets socket={socket} />
            </TargetSection>
          </SideSection>

          <InputSection>
            <SendMessagesBar socket={socket} />
          </InputSection>
        </Grid>
      </div>
    );
  }
}
