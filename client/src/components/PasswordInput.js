import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
        <form onSubmit={this.handlePasswordAdd}>
          Password: <input id="password" type="text" />
          <input type="submit" value="Submit" />
        </form>
        <form onSubmit={this.handlePasswordSend}>
          <input type="submit" value="Check" />
        </form>
        <p id="result">{this.state.result}</p>
        <p>Your guess</p>
        {this.state.password.map((keyWord, index) => (
          <p key={index}>{keyWord}</p>
        ))}
        <p>Your half of the password</p>
        {this.state.halfOfPass.map((keyWord, index) => (
          <p key={index}>{keyWord}</p>
        ))}
      </div>
    );
  }
}

PasswordInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default PasswordInput;
