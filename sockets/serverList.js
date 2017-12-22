var chatroom = require("./main.js");

module.exports = function(io) {
  //Room List
  var roomList = {};        

  //Create default rooms;
  // let roomA = io.of('RoomA');
  // roomList["RoomA"] =  roomA;
  // let roomB = io.of('RoomB');
  // roomList["RoomB"] =  roomB;
  // let roomC = io.of('RoomC');
  // roomList["RoomC"] =  roomC;

  roomList["RoomA"] =  new chatroom();
  roomList["RoomB"] =  new chatroom();
  roomList["RoomC"] =  new chatroom();

   
  // chatroom(io,"RoomB");
  // chatroom(io,"RoomC");

  io.on("connection", socket => {
    console.log("Connection new socket!");

    //Respond to Request to join
    socket.on("Request to join room",function(roomName){
      let success = true;
      //Check Reqs of current Room
      //Check if socket has already joined room
      //let alreadyInRoom = Object.keys(socket.adapter.rooms).length > 1;
      let alreadyInRoom = false;
      //Check if room exists
      let roomExists = Object.keys(roomList).indexOf(roomName)>=0;
      //Check if room has space
      //TODO

      if(!alreadyInRoom && roomExists){
        //If Reqs okay, move socket into desired room
        console.log(`Moving socket into ${roomName}`);
        socket.join(roomName);
        socket.emit("Request to join room", roomName);
        console.log(socket.adapter.rooms);
        roomList[roomName].connection(socket,roomName,io);
      }
    });

    //Update roomList 
    socket.on("Update roomList",function(){
      socket.emit("Update roomList", Object.keys(roomList));
    });
  });
};