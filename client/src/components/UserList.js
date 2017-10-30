import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import '../utils/animation.css';

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow
//Light purple: 153 84 196

const UserListContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template: 1fr 5fr/1fr;
  background: rgb(153, 84, 196);
  color: rgba(250, 250, 250, 1);
`;

const UserListHeader = styled.h1`
  grid-row: 1;
  text-align: center;
  @media (max-height: 500px) {
    font-size:1em;
  }
`;
const Scoreboard = styled.div`
  grid-row: 2;
  background: rgba(10, 10, 10, 0.2);
  border-radius: 5px;
  list-style-type: none;
  max-height: 400px;

  overflow: hidden;
  overflow-y: scroll;
  margin: 0 10px 10px 10px;
  padding: 0;
  display: grid;
  grid-template-columns: 70% 30%;

  @media (max-height: 500px) {
    height: 100px;
  }

  @media (min-height: 1000px) {
    max-height: 800px;
  }
`;

const Users = styled.ul`
  grid-column: 1;
  list-style-type: none;
  padding: 10px 0px 10px 10px;
  margin: 0;
`;
const Scores = styled.ul`
  grid-column: 2;
  list-style-type: none;
  text-align: center;
  padding: 10px 0px 10px 0px;
  margin: 0;
  border-left: 2px solid rgba(10, 10, 10, 0.2);
`;

const increasedScore = keyframes`
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(-5px);
    color: red;
  }
`;

const Score = styled.li`
`;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userScoreList: {}
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.socket.on("update userScorelist", userScoreList =>
      this.setState(() => ({ userScoreList: userScoreList }))
    );

    this.props.socket.on("update score", (username, score) => {
      let newScore = this.state.userScoreList;
      newScore[username] = score;
      this.setState(() => ({ userScorelist: newScore }));

      let scored = document.getElementById(`${username}Score`);
      if(scored.classList.contains("pointIncrease")){
        scored.classList.remove("pointIncrease");
      }
      //Adding this line causes a reflow allowing the animation to play itself again
      void scored.offsetWidth;
      
      scored.classList.add("pointIncrease");
    });
  }

  render() {
    let list = [];
    let userScoreList = this.state.userScoreList;
    for (var user in userScoreList) {
      //list.push(`${user}: ${this.state.userScoreList[user]}`);
      list.push([user, userScoreList[user]]);
    }

    return (
      <UserListContainer>
        <UserListHeader>User List</UserListHeader>
        <Scoreboard>
          <Users className="userlist">
            {list.map((user, index) => (
              <li id={`${user[0]}List`} key={index}>
                {user[0]}
              </li>
            ))}
          </Users>
          <Scores>
            {list.map((user, index) => (
              <Score id={`${user[0]}Score`} key={index}>
                {user[1]}
              </Score>
            ))}
          </Scores>
        </Scoreboard>
      </UserListContainer>
    );
  }
}

UserList.propTypes = {
  socket: PropTypes.object.isRequired
};

export default UserList;
