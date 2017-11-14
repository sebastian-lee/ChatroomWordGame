import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import PasswordInput from "./PasswordInput";
import AccuseInput from "./AccuseInput";
import Spy from "./Spy";
import Liar from "./Liar";
import Detective from "./Detective";

const RoleContainer = styled.div`
  background: rgb(153, 84, 196);
  height: 100%;
  color: rgb(250, 250, 250);
  display: grid;
  grid-template-rows: 50% 50%;
`;

const RoleItem = styled.p`
  padding: 10px;
  margin: 0;

  @media (max-height: 500px) {
    margin: 2.5px 0 2.5px 0;
  }
`;

const Username = RoleItem.extend`
  text-align: center;
  font-size: 1.3em;
`;

const RoleBackground = styled.div`
  background: rgba(10, 10, 10, 0.2);
  border-radius: 5px;
  margin: 0 10px 0 10px;
  align-self: center;
  overflow-y: scroll;
  height: 80%;
`;

const Timer = styled.p`
  margin:0;
  padding: 10px;
`;

class Roles extends Component {
  componentDidMount() {
    //list self's username
    this.props.socket.on("my username", function(username) {
      document.querySelector("#myUsername").textContent = `${username}`;
    });

    //list time left
    this.props.socket.on("time left", function(timeLeft) {
      let remainingSecs = timeLeft / 1000;
      let mins = Math.floor(remainingSecs / 60);
      remainingSecs = Math.round(remainingSecs % 60);
      document.querySelector(
        "#timer"
      ).textContent = `Time Remaining: ${mins}:${remainingSecs}`;
    });
  }
  render() {
    return (
      <RoleContainer>
        <RoleBackground>
          <Username id="myUsername">Your Username</Username>
          <Timer id="timer">Time Remaining: </Timer>
          <RoleItem id="role">Your Role: {this.props.role}</RoleItem>
        </RoleBackground>

        <RoleBackground>
          {this.props.role === "spy" && <Spy socket={this.props.socket} />}
          {this.props.role === "spy" && (
            <PasswordInput socket={this.props.socket} />
          )}
          {this.props.role === "detective" && <Detective/>}
          {this.props.role === "detective" && (
            <AccuseInput socket={this.props.socket} />
          )}
          {this.props.role === "liar" && <Liar />}
        </RoleBackground>
      </RoleContainer>
    );
  }
}

Roles.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Roles;
