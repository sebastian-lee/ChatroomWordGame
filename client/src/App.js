import React, { Component } from "react";
import io from "socket.io-client";
import styled from "styled-components";

//Import components
import Login from "./components/Login";
import MessageFeed from "./components/MessageFeed";
import UserList from "./components/UserList";
import Roles from "./components/Roles";
import SendMessagesBar from "./components/SendMessagesBar";
import MenuButton from "./components/MenuButton";
import AlertBar from "./components/AlertBar";

const socket = io();

//Basic Grid component
const Grid = styled.div`
  display: grid;
  grid-template: repeat(4, 1fr) 0.3fr / repeat(5, 20%);
  height: 100%;
  filter: blur(${props => (props.blur ? "5px" : "0px")});
  transition: 0.3s;
  overflow-x: hidden;
`;

/*
 * Message Section
 */
const MessageSection = styled.div`
  grid-column: 1/5;
  grid-row: 1/5;
  @media (max-width: 600px) {
    grid-column: 1/6;
  }
`;

/*
 * Side Section
 * 
 * Move side section to the right when less than 600px 
 * for mobile view
 */
const SideSection = styled.div`
  grid-column: 5/6;
  grid-row: 1/6;
  display: grid;
  grid-template-rows: 30% 70%;
  width: 100%;
  z-index: 0;
  transition: 0.5s;
  border-left: 2px solid rgba(113, 0, 176, 0.7);
  @media (max-width: 600px) {
    opacity: ${props => (props.sideOut ? "100" : "0")};
    width: ${props => (props.sideOut ? "50%" : "0")};
    position: absolute;
    height: 100vh;
    right: 0;
    z-index: 1;
    overflow-x: hidden;
  }
  @media (max-height: 500px) {
    grid-template-rows: 40% 60%;
  }
`;

const SidebarButton = styled.div`
  top: 0;
  right: 0;
  z-index: 5;
  display: none;
  padding-right: 5px;
  position: absolute;
  transition: 0.5s;

  @media (max-width: 600px) {
    display: block;
    margin-right: ${props => (props.sideOut ? "50%" : "0")};
  }
`;

const UserListSection = styled.div`grid-row: 1;`;

const RolesSection = styled.div`grid-row: 2;`;

/*
 * Input Section
 */
const InputSection = styled.div`
  grid-column: 1/5;
  grid-row: 5/6;
  border-top: 2px solid rgba(113, 0, 176, 0.7);

  @media (max-width: 600px) {
    grid-column: 1/6;
  }
`;



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blur: true,
      sideOut: false,
      role: ""
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
  }

  componentDidMount() {
    socket.on("logged in", success =>
      this.setState(() => ({ blur: !success }))
    );

    //add your role
    socket.on("my role", role => this.setState(() => ({ role: role })));
  }

  toggleSideBar() {
    this.setState(() => ({ sideOut: !this.state.sideOut }));
  }

  render() {
    let sideOut = this.state.sideOut;
    return (
      <div className="App">
        <Login socket={socket} />
        <AlertBar socket={socket} />
        <Grid blur={this.state.blur}>
          <MessageSection>
            <MessageFeed socket={socket} />
          </MessageSection>

          <SidebarButton sideOut={sideOut}>
            <MenuButton onClick={this.toggleSideBar} change={sideOut} />
          </SidebarButton>
          <SideSection sideOut={sideOut}>
            <UserListSection>
              <UserList socket={socket} />
            </UserListSection>

            <RolesSection>
              <Roles socket={socket} role={this.state.role} />
            </RolesSection>
          </SideSection>

          <InputSection>
            <SendMessagesBar socket={socket} />
          </InputSection>
        </Grid>
      </div>
    );
  }
}
