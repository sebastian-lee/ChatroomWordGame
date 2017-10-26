import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TargetsContainer = styled.div`
  background: rgba(113, 0, 176, 0.7);
  height: 100%;
  color: rgb(250, 250, 250);
`;

const TargetItems = styled.p`
  padding: 5px;
  margin: 10px 0 10px 0;
`;

const Username = TargetItems.extend`
  text-align: center;
  font-size: 1.3em;
`;

const TargetBackground = styled.div`
  padding: 15px;
  background: rgba(10,10,10,0.2);
  border-radius: 5px;
  margin: 0 10px 10px 10px;
`; 

class Targets extends Component {
  componentDidMount() {
    //list secret word
    this.props.socket.on("new target word", function(targetWord) {
      document.querySelector(
        "#targetWord"
      ).textContent = `Target Word: ${targetWord}`;
    });

    //list target user
    this.props.socket.on("new target user", function(targetUser) {
      document.querySelector(
        "#targetUser"
      ).textContent = `Target User: ${targetUser}`;
    });

    //list self's username
    this.props.socket.on("my username", function(username) {
      document.querySelector("#myUsername").textContent = `${username}`;
    });
  }
  render() {
    return (
      <TargetsContainer>
        <TargetBackground>
          <Username id="myUsername">Your Username</Username>
          <TargetItems id="targetWord">Target Word:</TargetItems>
          <TargetItems id="targetUser">Target User:</TargetItems>
        </TargetBackground>
      </TargetsContainer>
    );
  }
}

Targets.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Targets;
