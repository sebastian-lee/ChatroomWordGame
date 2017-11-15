import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, {keyframes} from "styled-components";

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow

const MESSAGE_LIMIT = 100;

const MessageContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 90% 10%;
  background-color: rgba(245,245,245,1);
`;

const Messages = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  overflow-y: scroll;
  grid-row: 1;
`;

const TypingList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  grid-row: 2;
  align-items: center;
  word-wrap: break-word;
`;

const popUp = keyframes`
from {
  opacity: 0;
  transform: translateY(5px);
}

to {
  opacity: 1;
  transform: translateY(0px);
}
`;

const Typing = styled.li`
  animation: ${popUp} 0.1s linear;
  margin: 5px;
  color: rgba(10, 10, 10, 0.5);
`;

const Message = styled.li`
  word-wrap: break-word;
  margin: 25px 5px 25px 5px;
  ${props => (props.type == "self" ? "text-align:right;" : "")};

  p {
    display: inline;
    padding: 10px;
    color: rgba(250, 250, 250, 1);
    background: rgba(113, 0, 176, 0.7);
    border-radius: 12px;

    ${props => {
      switch (props.type) {
        case "chat":
          return `
          color: rgba(10, 10, 10, 1);
          background: rgba(10, 10, 10, 0.1);`;
        case "self":
          return `background: rgba(113, 0, 176, 0.7);`;
        case "connected":
          return `
            color: rgba(130, 180, 130, 1);
            font-size: 1.1em;
            font-weight: bold;
            background: none;
          `;
        case "disconnected":
          return `
            color: rgba(180, 130, 130, 1);
            font-size: 1.1em;
            font-weight: bold;
            background: none;
          `;
        case "server":
          return `
            color: rgba(130, 130, 180, 1);
            font-size: 1.1em;
            font-weight: bold;
            background: none;
          `;
        default:
          return "background: rgba(113, 0, 176, 0.7);";
      }
    }};
  }
`;

class MessageFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      typingList: []
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  appendNewMessage(type, msg) {
    var messageList = this.state.messages;
    if (messageList.length >= MESSAGE_LIMIT) {
      messageList.splice(0, 1);
    }
    messageList.push([type, msg]);
    this.forceUpdate();
    var messages = document.querySelector("#messages");
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
  }

  componentDidMount() {
    //Append newly recieved messages to list
    this.props.socket.on("chat message", msg => {
      this.appendNewMessage("chat", `${msg.username}: ${msg.msg}`);
    });

    //Append Self message
    this.props.socket.on("self message", msg => {
      this.appendNewMessage("self", `${msg.username}: ${msg.msg}`);
    });

    //Notify that a user has joined the server
    this.props.socket.on("user connected", username => {
      this.appendNewMessage("connected", `${username} has joined`);
    });
    
    //Notify that a user has joined the server
    this.props.socket.on("server message", msg => {
      this.appendNewMessage("server", msg);
    });

    //Notify that a user has left the server
    this.props.socket.on("user disconnected", username => {
      this.appendNewMessage("disconnected", `${username} has left`);
    });

    this.props.socket.on("game start", () => {
      this.setState({messages: []});
    });

    //Someone is typing in chat.
    this.props.socket.on("typing", username => {
      var typingList = this.state.typingList;
      typingList.push(username);
      this.forceUpdate();
    });

    //Someone stop typing in chat.
    this.props.socket.on("stop typing", function(username) {
      var typing = document.querySelector("#typing");
      for (let i = 0; i < typing.children.length; i++) {
        if (typing.children[i].id == `${username}Typing`) {
          typing.removeChild(typing.children[i]);
        }
      }
    });
  }

  render() {
    return (
      <MessageContainer>
        <Messages id="messages">
          {this.state.messages.map((message,index) => (
            <Message key={index} type={message[0]}>
              <p>{message[1]}</p>
            </Message>
          ))}
        </Messages>
        <TypingList id="typing">
          {this.state.typingList.map((username,index) => (
            <Typing key={index} id={`${username}Typing`}>{username} is typing...</Typing>
          ))}
        </TypingList>
      </MessageContainer>
    );
  }
}

MessageFeed.propTypes = {
  socket: PropTypes.object.isRequired
};

export default MessageFeed;
