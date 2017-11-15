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
const Userboard = styled.div`
  grid-row: 2;
  background: rgba(10, 10, 10, 0.2);
  border-radius: 5px;
  list-style-type: none;
  max-height: 400px;

  overflow: hidden;
  overflow-y: scroll;
  margin: 0 10px 10px 10px;
  padding: 0;

  @media (max-height: 500px) {
    height: 100px;
  }

  @media (min-height: 1000px) {
    max-height: 800px;
  }
`;

const Users = styled.ul`
  list-style-type: none;
  padding: 10px 0px 10px 10px;
  margin: 0;
`;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userlist: {}
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.socket.on("update userlist", userlist =>
      this.setState(() => ({ userlist }))
    );
  }

  render() {
    let list = [];
    let userlist = this.state.userlist;
    for (var user in userlist) {
      list.push([user, userlist[user]]);
    }

    return (
      <UserListContainer>
        <UserListHeader>User List</UserListHeader>
        <Userboard>
          <Users className="userlist">
            {list.map((user, index) => (
              <li id={`${user[0]}List`} key={index}>
                {user[0]}
              </li>
            ))}
          </Users>
        </Userboard>
      </UserListContainer>
    );
  }
}

UserList.propTypes = {
  socket: PropTypes.object.isRequired
};

export default UserList;
