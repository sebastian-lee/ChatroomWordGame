import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";
import DeleteItem from "./DeleteItem";

const PasswordBar = styled(InputBar)`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const GuessedPassword = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;

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
  margin-left: 10px;
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

const PadText = styled.p`
  margin: 0;
  padding: 10px;
`;

class AccuseInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accused: [],
      result: ""
    };

    this.handleAccuseAdd = this.handleAccuseAdd.bind(this);
    this.handleAccuseSend = this.handleAccuseSend.bind(this);
    this.handleDeleteWord = this.handleDeleteWord.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleAccuseAdd(e) {
    e.preventDefault();
    var accuse = document.querySelector("#accuse");
    if (accuse.value != "") {
      this.state.accused.push(accuse.value);
      this.forceUpdate();
      accuse.value = "";
    }
  }

  handleAccuseSend(e) {
    e.preventDefault();
    this.props.socket.emit("accused submit", this.state.accused);
    this.setState(() => ({ accused: [] }));
  }

  handleDeleteWord(index) {
    this.setState({
      accused: [
        ...this.state.accused.slice(0, index),
        ...this.state.accused.slice(index + 1)
      ]
    });
  }

  componentDidMount() {
    this.props.socket.on("accused result", (success, attempts) => {
      this.setState(() => ({
        result: `Your guess was ${success}: You have ${attempts} attempts left`
      }));
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleAccuseAdd}>
          <PadText> Accuse:</PadText>
          <PasswordBar round={true} inputID="accuse" />
        </form>
        <PadText>Your guess</PadText>
        <GuessedPassword>
          {this.state.accused.map((accused, index) => (
            <li key={index}>
              <GuessedWord>{accused}</GuessedWord>
              <DeleteItem onXClick={this.handleDeleteWord} value={index} />
            </li>
          ))}
        </GuessedPassword>

        <CheckButton onClick={this.handleAccuseSend}>Check</CheckButton>

        <PadText id="result">{this.state.result}</PadText>
      </div>
    );
  }
}

AccuseInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default AccuseInput;
