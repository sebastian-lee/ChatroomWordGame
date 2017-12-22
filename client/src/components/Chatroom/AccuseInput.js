import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputBar from "./InputBar";
import DeleteItem from "./DeleteItem";
import RoleInput from "./RoleInput";

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
      <RoleInput
        handleInputAdd={this.handleAccuseAdd}
        inputText={"Accuse:"}
        inputID={"accuse"}
        GuessList={this.state.accused}
        handleDeleteWord={this.handleDeleteWord}
        handleInputSend={this.handleAccuseSend}
        result={this.state.result}
      />
    );
  }
}

AccuseInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default AccuseInput;
