import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";

//Login Section
const LoginScreen = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  background: rgba(10, 10, 10, 0.2);
  display: ${props => (props.loggedIn ? "none" : "grid")};
  grid-template-row: 1fr 1fr 1fr;
`;

const LoginSection = styled.div`
  text-align: center;
  grid-row: 2;
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

    this.props.socket.on("not unique username", () =>{
        document.getElementById("loginHeader").textContent = "Username taken, try another one";
    });
  }

  render() {
    return (
      <LoginScreen loggedIn={this.state.loggedIn} id="loginScreen">
        <LoginSection>
          <h1 id="loginHeader">Enter a username</h1>
          <InputBar
            formID="usernameForm"
            inputID="username"
            buttonText="Enter Username"
            onSubmit={this.handleUsernameSubmit}
          />
        </LoginSection>
      </LoginScreen>
    );
  }
}

Login.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Login;
