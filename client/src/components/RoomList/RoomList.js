import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from 'react-router-dom';
import styled from "styled-components";

import Chatroom from "../Chatroom/Chatroom";
//Make sure to pass socket from io into Chatroom

export default class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms : [],
      redirectToRoom : false,
      clickedRoom : "",
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
  }

  componentDidMount() {
    //Ask for new room list
    console.log("Requesting rooms");
    this.props.socket.emit("Update roomList");

    //On recieving newest roomlist
    this.props.socket.on("Update roomList",(roomList)=>{
      console.log(roomList);
      this.setState({
        rooms: roomList
      });
    });

    //Check if joining room was successful
    this.props.socket.on("Request to join room",(roomName)=>{
      if(roomName){
        //Redirect into room
        console.log(`successfully joining ${roomName}`);
        this.setState({
          redirectToRoom : true,
          clickedRoom: roomName
        });
      }
    });
  }

  handleJoinRoom(event){
    event.preventDefault();
    let roomName = event.target.value;
    this.props.socket.emit("Request to join room", roomName);
  }

  render() {
    if(this.state.redirectToRoom && this.state.clickedRoom!= ""){
      return <Redirect to={`/room/${this.state.clickedRoom}`} />;
    }
    return (
      <div>
        {this.state.rooms.map((roomName)=>{
          return <button onClick={this.handleJoinRoom} key={roomName} value={roomName}>{roomName}</button>
        })}
      </div>
    );
  }
}


RoomList.propTypes = {
  socket: PropTypes.object.isRequired
}

