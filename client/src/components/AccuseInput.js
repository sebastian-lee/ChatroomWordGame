import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class AccuseInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accused: [],
      result: ""
    };

    this.handleAccuseAdd = this.handleAccuseAdd.bind(this);
    this.handleAccuseSend = this.handleAccuseSend.bind(this);
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
          Accuse: <input id="accuse" type="text" />
          <input type="submit" value="Submit" />
        </form>

        <form onSubmit={this.handleAccuseSend}>
          <input type="submit" value="Check" />
        </form>
        <p id="result">{this.state.result}</p>
        {this.state.accused.map((accused, index) => (
          <p key={index}>{accused}</p>
        ))}
      </div>
    );
  }
}

AccuseInput.propTypes = {
  socket: PropTypes.object.isRequired
};

export default AccuseInput;
