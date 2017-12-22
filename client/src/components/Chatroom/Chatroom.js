import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//Import components
import Login from "./Login";
import MessageFeed from "./MessageFeed";
import UserList from "./UserList";
import Roles from "./Roles";
import SendMessagesBar from "./SendMessagesBar";
import MenuButton from "./MenuButton";
import AlertBar from "./AlertBar";
import GameSetting from "./GameSetting";

//Basic Grid component
const Grid = styled.div`
  display: grid;
  grid-template: repeat(4, 1fr) 0.3fr / repeat(5, 20%);
  min-height: 100%;
  filter: blur(${props => (props.blur ? "5px" : "0px")});
  transition: 0.3s;
  overflow-x: hidden;
  overflow-y: hidden;
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



export default class Chatroom extends Component {
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
    this.props.socket.on("logged in", success =>
      this.setState(() => ({ blur: !success }))
    );

    //add your role
    this.props.socket.on("my role", role => this.setState(() => ({ role: role })));
  }

  toggleSideBar() {
    this.setState(() => ({ sideOut: !this.state.sideOut }));
  }

  render() {
    let sideOut = this.state.sideOut;
    let socket =  this.props.socket;
    console.log(this.props.match.params.roomName);
    return (
      <div className="App">
        <Login socket={socket} />
        <AlertBar socket={socket} />
        <GameSetting socket={socket} />
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

Chatroom.propTypes = {
  socket: PropTypes.object.isRequired
}
