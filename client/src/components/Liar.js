import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Instructions = styled.p`
margin:0;
padding: 10px;
`;

class Liar extends Component {
  render() {
    return (
        <Instructions>
          You want to make the Detectives think you're a spy!
          <br/><br/>
          The spies want to communicate a second password to each other. Pretend to be one of them!
          <br/><br/>
          You will need both detectives to accuse you of being a spy at least once.
        </Instructions>
    );
  }
}

Liar.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Liar;
