import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const RoleContainer = styled.div`
  background: rgb(153, 84, 196);
  height: 100%;
  color: rgb(250, 250, 250);
  display: flex;
`;

const RoleItem = styled.p`
  padding: 5px;
  margin: 10px 0 10px 0;

  @media (max-height: 500px) {
    margin: 2.5px 0 2.5px 0;
  }
`;

const Username = RoleItem.extend`
  text-align: center;
  font-size: 1.3em;
`;

const RoleBackground = styled.div`
  padding: 5px;
  width: 100%;
  background: rgba(10, 10, 10, 0.2);
  border-radius: 5px;
  margin: 0 10px 0 10px;
  align-self: center;

  @media (max-height: 500px) {
    padding: 5px;
  }
`;

class Roles extends Component {

  componentDidMount() {
    //list self's username
    this.props.socket.on("my username", function(username) {
      document.querySelector("#myUsername").textContent = `${username}`;
    });

    //list time left
    this.props.socket.on("time left", function(timeLeft) {
      let remainingSecs = timeLeft/1000;
      let mins = Math.floor(remainingSecs/60);
      remainingSecs = Math.round(remainingSecs%60);
      document.querySelector("#timer").textContent = `Time Remaining: ${mins}:${remainingSecs}`;
    });
    
  }
  render() {
    return (
      <RoleContainer>
        <RoleBackground>
          <Username id="myUsername">Your Username</Username>
          <p id="timer">Time Remaining: </p>
          <RoleItem id="role">Your Role: {this.props.role}</RoleItem>
        </RoleBackground>
      </RoleContainer>
    );
  }
}

Roles.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Roles;
