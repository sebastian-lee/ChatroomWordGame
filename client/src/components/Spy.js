import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class Spy extends Component {

  componentDidMount() {
    //recieve info on other spy
    this.props.socket.on("other spy", function(otherSpyName) {
      console.log(otherSpyName);
      document.querySelector("#otherSpies").textContent = `Other Spy: ${otherSpyName}`;
    });
  }
  render() {
    return (
      <div>
        <p id="otherSpies"></p>
      </div>
    );
  }
}

Spy.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Spy;
