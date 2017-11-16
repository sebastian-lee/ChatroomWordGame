import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Instructions = styled.p`
margin:0;
padding: 10px;
`;

const PadText = styled.p`
margin: 0;
padding: 10px;
`;

class Spy extends Component {
  componentDidMount() {
    //recieve info on other spy
    this.props.socket.on("other spy", function(otherSpyName) {
      console.log(otherSpyName);
      document.querySelector(
        "#otherSpies"
      ).textContent = `Other Spy: ${otherSpyName}`;
    });
  }
  render() {
    return (
      <div>
        <Instructions>
          Figure out what the rest of the 6 word password is. 
          <br/><br/>
          Your fellow spy has the rest of the password, but both of you don't want to get caught 
          by the detectives.
          <br/><br/>
          You each have 3 attempts at guessing the password.
        </Instructions>

        <PadText id="otherSpies" ></PadText>
      </div>
    );
  }
}

Spy.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Spy;
