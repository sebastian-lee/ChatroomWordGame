import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow

const AlertScreen = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  background: rgba(10, 10, 10, 0.2);
  display: ${props => (props.alert ? "grid" : "none")};
  grid-template-row: 1fr 1fr 1fr;
  color: rgba(250, 250, 250, 1);
  text-shadow: 0px 1px 1px rgba(10, 10, 10, 0.8);
`;

const AlertSection = styled.div`
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

class AlertBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alertScreen: false,
      message: ""
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.socket.on("game over", winners => {
      let gameoverStatement = "";
      let allLost = true;
      for (let group in winners) {
        if (winners[group] == true) {
          allLost = false;
        }
        switch (group) {
          case "detectives":
            if (winners[group] == true) {
              gameoverStatement += "Detectives have won! \n";
            } else {
              gameoverStatement += "Detectives have loss! \n";
            }
            break;
          case "spies":
            if (winners[group] == true) {
              gameoverStatement += "Spies have won! \n";
            } else {
              gameoverStatement += "Spies have loss! \n";
            }
            break;
          case "liar":
            if (winners[group] == true) {
              gameoverStatement += "The liar has won! \n";
            } else {
              gameoverStatement += "The liar has loss! \n";
            }
            break;
          default:
            break;
        }
      }

      if (allLost) {
        gameoverStatement = "Everyone lost!";
      }

      //Set alert to visible
      this.setState(() => ({ alertScreen: true }));
      this.setState(() => ({ message: gameoverStatement }));
    });
  }

  render() {
    return (
      <AlertScreen alert={this.state.alertScreen} id="alertScreen">
        <AlertSection>
          <p>{this.state.message}</p>
        </AlertSection>
      </AlertScreen>
    );
  }
}

AlertBar.propTypes = {
  socket: PropTypes.object.isRequired
};

export default AlertBar;
