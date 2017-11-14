import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow

//Login Section
const LoginScreen = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  background: rgba(10, 10, 10, 0.2);
  display: ${props => (props.loggedIn ? "none" : "grid")};
  grid-template-row: 1fr 1fr 1fr;
  color: rgba(250, 250, 250, 1);
  text-shadow: 0px 1px 1px rgba(10, 10, 10, 0.8);
`;

const LoginSection = styled.div`
  text-align: center;
  height: 300px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  grid-row: 2;
  z-index: 1;
  display: grid;
  grid-template-row: 1fr 1fr 1fr 1fr;
  background: rgba(113, 0, 176, 0.5);
  border-radius: 15px;
  padding: 15px;

  p {
    margin: 0;
  }

  @media (max-width: 600px) {
    width: 80%;

    padding: 15px;

    p {
      font-size: 1em;
    }
  }
`;

const Header = styled.h1`
  font-size: 2.5em;
  grid-row: 1;
  border-radius: 15px;
  padding: 5px;
  border: 5px solid rgba(250, 250, 250, 1);
  text-shadow: rgba(113, 0, 176, 0.8);
`;

const InputSection = styled.div`
  grid-row: 4;

  h2 {
    margin: 5px 0 5px 0;
  }
`;

const LoginBar = styled(InputBar)`
  width:80%;
  margin-left:auto;
  margin-right:auto;

  input {
    font-size: 1.5em;
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
  }

  handleUsernameSubmit(event) {
    //Prevent page refresh from submit
    event.preventDefault();
    //listen for form to submit new username
    const usernameForm = document.querySelector("#usernameForm");
    const input = usernameForm.querySelector("#username");
    let username = input.value;
    usernameForm.reset();
    this.props.socket.emit("add username", username);
  }

  componentDidMount() {
    this.props.socket.on("logged in", success =>
      this.setState(() => ({ loggedIn: success }))
    );

    this.props.socket.on("not unique username", () => {
      document.getElementById("loginHeader").textContent =
        "Username taken, try another one";
    });
  }

  render() {
    return (
      <LoginScreen loggedIn={this.state.loggedIn} id="loginScreen">
        <LoginSection>
          <Header>Chatroom Word Game</Header>
          <p>Convince your target to say your target word!</p>
          <InputSection>
            <h2 id="loginHeader">Enter a username</h2>
            <LoginBar
              round={true}
              formID="usernameForm"
              inputID="username"
              onSubmit={this.handleUsernameSubmit}
            />
          </InputSection>
        </LoginSection>
      </LoginScreen>
    );
  }
}

Login.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Login;
