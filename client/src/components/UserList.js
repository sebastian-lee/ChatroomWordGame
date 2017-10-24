import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const UserListContainer = styled.div`
  display: grid;
  grid-template: 10% 90%/1fr;
`;

const UserListHeader = styled.h1`
  grid-row: 1;
  text-align: center;
`;

const Users = styled.ul`
  grid-row: 2;
  border: 1px solid rgba(10, 10, 10, 0.2);
  list-style-type: none;
  height: 200px;
  overflow: hidden;
  overflow-y: scroll;
  margin: 0 10px 0 10px;

  @media (max-height: 500px) {
    height: 100px;
	}
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
    });
  }

  render() {
    let list = [];
    for (var user in this.state.userScoreList) {
      list.push(`${user}: ${this.state.userScoreList[user]}`);
    }

    return (
      <UserListContainer>
        <UserListHeader>User List</UserListHeader>
        <Users className="userlist">
          {list.map((user, index) => <li key={index}>{user}</li>)}
        </Users>
      </UserListContainer>
    );
  }
}

UserList.propTypes = {
  socket: PropTypes.object.isRequired
};

export default UserList;
