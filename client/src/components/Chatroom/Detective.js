import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PadText from "./PadText";
import AccuseInput from "./AccuseInput";

const Instructions = PadText.extend`
  border-bottom: 2px solid rgba(10, 10, 10, 0.2);
`;

class Detective extends Component {
  render() {
    return (
      <div>
        <Instructions>
          You want to figure out who the 2 spies are!
          <br />
          <br />
          The spies want to communicate a second password to each other but will
          try hiding it from you.
          <br />
          <br />
          There is also a liar amongst the group who will pretend to be a spy.
          Don't accuse liar of being a spy.
          <br />
          <br />
          You also have a fellow detective. Each of you will both have 3
          attempts and making a guess who the spy is.
        </Instructions>

        <AccuseInput socket={this.props.socket} />
      </div>
    );
  }
}

Detective.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Detective;
