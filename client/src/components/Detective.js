import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Instructions = styled.p`
margin:0;
padding: 10px;
border-bottom: 2px solid rgba(10, 10, 10, 0.2);
`;

class Detective extends Component {
  render() {
    return (
        <Instructions>
          You want to figure out who the 2 spies are!
          <br/><br/>
          The spies want to communicate a second password to each other but will try hiding it from you.
          <br/><br/>
          There is also a liar amongst the group who will pretend to be a spy. Don't accuse liar of being a spy.
          <br/><br/>
          You also have a fellow detective. Each of you will both have 3 attempts and making a guess who the spy is.
        </Instructions>
    );
  }
}

Detective.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Detective;
