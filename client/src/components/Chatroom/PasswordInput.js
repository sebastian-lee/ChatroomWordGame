import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";
import DeleteItem from "./DeleteItem";
import RoleInput from "./RoleInput";

import PadText from "./PadText";

const InitPass = styled.div`
  border-bottom: 2px solid rgba(10, 10, 10, 0.2);
  border-top: 2px solid rgba(10, 10, 10, 0.2);
  margin: 5px auto 5px auto;
  text-align: center;
`;

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: [],
      halfOfPass: [],
      result: ""
    };

    this.handlePasswordAdd = this.handlePasswordAdd.bind(this);
    this.handlePasswordSend = this.handlePasswordSend.bind(this);
    this.handleDeleteWord = this.handleDeleteWord.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handlePasswordAdd(e) {
    e.preventDefault();
    var password = document.querySelector("#password");
    if (password.value != "") {
      this.state.password.push(password.value);
      this.forceUpdate();
      password.value = "";
    }
  }

  handleDeleteWord(index) {
    this.setState({
      password: [
        ...this.state.password.slice(0, index),
        ...this.state.password.slice(index + 1)
      ]
    });
  }

  handlePasswordSend(e) {
    e.preventDefault();
    this.props.socket.emit("password submit", this.state.password);
    this.setState(() => ({ password: [] }));
  }

  componentDidMount() {
    this.props.socket.on("password result", (success, attempts) => {
      this.setState(() => ({
        result: `The password was ${success}: You have ${attempts} attempts left`
      }));
    });

    this.props.socket.on("starting password", halfOfPass => {
      this.setState({ halfOfPass: halfOfPass });
    });
  }
  render() {
    return (
      <div>
        <InitPass>
          <PadText>Your half of the password:</PadText>
          {this.state.halfOfPass.map((keyWord, index) => (
            <p key={index}>{keyWord}</p>
          ))}
        </InitPass>

        <RoleInput
          handleInputAdd={this.handlePasswordAdd}
          inputText={"Password:"}
          inputID={"password"}
          GuessList={this.state.password}
          handleDeleteWord={this.handleDeleteWord}
          handleInputSend={this.handlePasswordSend}
          result={this.state.result}
        />
      </div>
    );
  }
}

PasswordInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default PasswordInput;
