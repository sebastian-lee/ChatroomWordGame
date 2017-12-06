import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow

const PopupScreen = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  background: rgba(10, 10, 10, 0.2);
  display: ${props => (props.popup ? "grid" : "none")};
  grid-template-row: 1fr 1fr 1fr;
  color: rgba(250, 250, 250, 1);
  text-shadow: 0px 1px 1px rgba(10, 10, 10, 0.8);
`;

const PromptSection = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  height: fit-content;
  grid-row: 2;
  z-index: 2;
  display: grid;
  grid-template-row: 1fr 1fr 1fr 1fr;
  background: rgba(113, 0, 176, 0.5);
  border-radius: 15px;
  padding: 15px;

  p {
    margin: 0;
    font-size: 2em;
  }

  @media (max-width: 600px) {
    width: 80%;

    padding: 15px;

    p {
      font-size: 1em;
    }
  }
`;

const StartButton = styled.div`
  border-radius: 10px;
  padding: 5px 10px 5px 10px;
  margin: 10px auto 10px auto;

  background-color: rgba(245, 245, 245, 1);
  color: rgb(178, 131, 211);
  width: fit-content;
  transform: translateY(-2px);
  box-shadow: 0px 2px 2px rgba(10, 10, 10, 0.3);
  transition: 0.3s;
  border: 2px solid rgba(179, 46, 252, 0);

  &:active {
    transform: translateY(0px);
    box-shadow: 0px 0px 0px rgba(10, 10, 10, 0.3);
    background-color: rgba(225, 225, 225, 1);
  }

  &:hover {
    background-color: rgba(225, 225, 225, 1);
    border: 2px solid rgba(179, 46, 252, 0.5);
    border-style: inset;
  }
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
`;

class GameSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popupScreen: false,
      options: [],
      list: ""
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  handleStart() {
    this.props.socket.emit("start game", this.state.list);
    this.setState(() => ({ popupScreen: false }));
  }

  handleChange(event) {
    this.setState({ list: event.target.value });
  }

  componentDidMount() {
    this.props.socket.on("game settings", options => {
      this.setState(() => ({
        popupScreen: true,
        options
      }));
    });
  }

  render() {
    return (
      <PopupScreen popup={this.state.popupScreen} id="popupScreen">
        <PromptSection>
          <p>Game Settings</p>
          <SettingsForm onSubmit={this.handleSubmit}>
            <label>Word Lists</label>
            <select value={this.state.value} onChange={this.handleChange}>
              {this.state.options.map(optionsArr => {
                return <option value={optionsArr[1]}>{optionsArr[0]}</option>;
              })}
            </select>
          </SettingsForm>
          <StartButton onClick={this.handleStart}>
            <p>Start Game</p>
          </StartButton>
        </PromptSection>
      </PopupScreen>
    );
  }
}

GameSetting.propTypes = {
  socket: PropTypes.object.isRequired
};

export default GameSetting;
