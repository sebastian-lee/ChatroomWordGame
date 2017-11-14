import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";
import DeleteItem from "./DeleteItem";

const PasswordBar = styled(InputBar)`width: 80%;`;

const GuessedPassword = styled.ul`
  list-style: none;
  padding: 0;

  li {
    margin: 5px 0 5px 0;
    display: grid;
    grid-template-columns: 80% 20%;
  }
`;

const GuessedWord = styled.p`
  grid-column: 1;
  margin: 0;
  color: rgba(10, 10, 10, 0.8);

  border-radius: 15px;
  padding: 5px;
  background-color: rgba(245, 245, 245, 1);
`;

const CheckButton = styled.div`
  border-radius: 10px;
  padding: 5px 10px 5px 10px;
  background-color: rgba(245, 245, 245, 1);
  color: rgba(10, 10, 10, 0.8);
  width: fit-content;
  transform: translateY(-2px);
  box-shadow: 0px 2px 2px rgba(10, 10, 10, 0.3);
  transition: 0.3s;

  &:active {
    transform: translateY(0px);
    box-shadow: 0px 0px 0px rgba(10, 10, 10, 0.3);
    background-color: rgba(225, 225, 225, 1);
  }
`;

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
          <p>Your half of the password:</p>
          {this.state.halfOfPass.map((keyWord, index) => (
            <p key={index}>{keyWord}</p>
          ))}
        </InitPass>

        <form onSubmit={this.handlePasswordAdd}>
          Password:
          <PasswordBar round={true} inputID="password" />
        </form>
        <p>Your guess</p>
        <GuessedPassword>
          {this.state.password.map((keyWord, index) => (
            <li key={index}>
              <GuessedWord>{keyWord}</GuessedWord>
              <DeleteItem onXClick={this.handleDeleteWord} value={index} />
            </li>
          ))}
        </GuessedPassword>

        <CheckButton onClick={this.handlePasswordSend}>Check</CheckButton>

        <p id="result">{this.state.result}</p>
      </div>
    );
  }
}

PasswordInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default PasswordInput;
