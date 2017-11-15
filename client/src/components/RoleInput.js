import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";
import DeleteItem from "./DeleteItem";
import PadText from "./PadText";

const RoleInputBar = styled(InputBar)`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const GuessList = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;

  li {
    margin: 5px 0 5px 0;
    display: grid;
    grid-template-columns: 80% 20%;
  }
`;

const GuessItem = styled.p`
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

class RoleInput extends Component {

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleInputAdd}>
          <PadText>{this.props.inputText}</PadText>
          <RoleInputBar round={true} inputID={this.props.inputID} />
        </form>
        
        <PadText>Your guess</PadText>
        <GuessList>
          {this.props.GuessList.map((keyWord, index) => (
            <li key={index}>
              <GuessItem>{keyWord}</GuessItem>
              <DeleteItem onXClick={this.props.handleDeleteWord} value={index} />
            </li>
          ))}
        </GuessList>

        <CheckButton onClick={this.props.handleInputSend}>Check</CheckButton>

        <PadText id="result">{this.props.result}</PadText>
      </div>
    );
  }
}

RoleInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default RoleInput;
