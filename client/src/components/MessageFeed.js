import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const MESSAGE_LIMIT = 100;

const MessageContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 90% 10%;
`;

const Messages = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  overflow-y: scroll;
  grid-row: 1;
`;

const Typing = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  grid-row: 2;
  align-items: center;
`;

class MessageFeed extends Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  appendNewMessage(msg) {
    var message = document.createElement("li");
    message.textContent = `${msg}`;
    var messages = document.querySelector("#messages");
    messages.append(message);
    //Scroll to bottom of the div
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    if (messages.children.length > MESSAGE_LIMIT){
      messages.removeChild(messages.children[0]);
    }
  }

  componentDidMount() {
    //Append newly recieved messages to list
    this.props.socket.on("chat message", msg => {
      this.appendNewMessage(`${msg.username}: ${msg.msg}`);
    });

    //Notify that a user has joined the server
    this.props.socket.on("user connected", username => {
      this.appendNewMessage(`${username} has joined`);
    });

    //Notify that a user has left the server
    this.props.socket.on("user disconnected", username => {
      this.appendNewMessage(`${username} has left`);
    });

    //Someone is typing in chat.
    this.props.socket.on("typing", function(username) {
      var isTyping = document.createElement("li");
      isTyping.textContent = `${username} is typing...`;
      isTyping.id = username;
      var typing = document.querySelector("#typing");
      typing.append(isTyping);
    });

    //Someone stop typing in chat.
    this.props.socket.on("stop typing", function(username) {
      var typing = document.querySelector("#typing");
      for (let i = 0; i < typing.children.length; i++) {
        if (typing.children[i].id == username) {
          typing.removeChild(typing.children[i]);
        }
      }
    });
  }

  render() {
    return (
      <MessageContainer>
        <Messages id="messages" />
        <Typing id="typing" />
      </MessageContainer>
    );
  }
}

MessageFeed.propTypes = {
  socket: PropTypes.object.isRequired
};

export default MessageFeed;