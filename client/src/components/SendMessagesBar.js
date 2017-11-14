import React, { Component } from "react";
import PropTypes from "prop-types";
import InputBar from "./InputBar";
import styled from "styled-components";

const StyledMessageBar = styled(InputBar)`
  height: 100%;
  input {
    font-size: 1em;
  }
`;

class SendMessagesBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typing: false
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleSendMessage(e) {
    e.preventDefault();
    var m = document.querySelector("#m");
    if (m.value != "") {
      this.props.socket.emit("chat message", m.value);

      if (this.state.typing) {
        this.props.socket.emit("stop typing");
        this.setState(() => ({ typing: false }));
      }
      m.value = "";
    }
  }

  componentDidMount() {
    //Check if user is typing
    var input = document.getElementById("m");
    const TYPING_TIMER_LENGTH = 400;
    var lastTypingTime;

    input.addEventListener("input", () => {
      if (!this.state.typing) {
        this.props.socket.emit("typing");
        this.setState(() => ({ typing: true }));
      }

      lastTypingTime = new Date().getTime();

      setTimeout(() => {
        var typingTimer = new Date().getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && this.state.typing) {
          this.props.socket.emit("stop typing");
          this.setState(() => ({ typing: false }));
        }
      }, TYPING_TIMER_LENGTH);
    });
  }

  render() {
    return (
      <StyledMessageBar
        formID="messaging"
        inputID="m"
        onSubmit={this.handleSendMessage}
      />
    );
  }
}

SendMessagesBar.propTypes = {
  socket: PropTypes.object.isRequired
};

export default SendMessagesBar;
