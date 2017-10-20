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
`;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userlist: "",
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  updateUserlist(userlist) {
    //userlist is an array of names
    var listItems = userlist.map(username => {
      return <li key={username}>{username}</li>;
    });
    this.setState(() => ({ userlist: listItems }));
  }

  componentDidMount(){
    this.props.socket.on("update userlist", userlist => this.updateUserlist(userlist));
  }

  render() {
    return (
      <UserListContainer>
        <UserListHeader>User List</UserListHeader>
        <Users className="userlist">{this.state.userlist}</Users>
      </UserListContainer>
    );
  }
}

UserList.propTypes = {
    socket: PropTypes.object.isRequired
}

export default UserList;
