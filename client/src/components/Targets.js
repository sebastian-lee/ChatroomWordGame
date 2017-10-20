import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
  }
  render() {
    return (
      <div>
        <p id="targetWord">Target Word:</p>
        <p id="targetUser">Target User:</p>
      </div>
    );
  }
}

Targets.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Targets;
