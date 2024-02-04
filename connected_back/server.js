const { createServer } = require("http");
const { Server } = require("socket.io");
const { join } = require('path');
const app = require('./app');
const jwt = require('jsonwebtoken');

const port = 4000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});


let roomData = {

};

let userData = {
};


function generate_random_string(length) {
  let random_string = '';
  let random_ascii;
  for (let i = 0; i < length; i++) {
    random_ascii = Math.floor((Math.random() * 25) + 97);
    random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}

function createRoom(socketId) {
  let roomId = generate_random_string(10);
  roomData[roomId] = {
    host: socketId,
    users: [
      {
        "userData": userData[socketId],
        "live": true,
      }
    ],
    isPlaying: true,
    speed: 1.0,
  };
  return roomId;
}



io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {

    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET_KEY, function (err, decoded) {
      if (err) {
        console.log('Authentication error', err);

      } else {
        decoded.userId = decoded.id;
        decoded.profileImage = '/avatar.png';
        decoded.color = Math.floor(Math.random() * 360);
        // get random int between 0 and 360
        decoded.socketId = socket.id;

        socket.decoded = decoded;
        socket.data = decoded;
        console.log(socket.handshake.query.token, process.env.JWT_SECRET_KEY);

      }
      next();

    });
  }
  else {
    next();
  }
}).on('connection', (socket) => {
  console.log('연결');
  console.log(socket.data);

  if (socket.decoded != undefined) {
    userData[socket.id] = socket.decoded;
  } else {

  }

  if (socket.decoded == undefined || socket.decoded.userId == undefined) {
    console.log("err");
    socket.emit('error', '로그인이 필요합니다.');
    return;
  };

  let roomId = createRoom(socket.id);
  socket.join(roomId);

  socket.emit('updateRoomInfo', {
    roomId: roomId,
    roomData: roomData[roomId]
  });


  socket.on('joinRoom', (joinRoomId) => {
    console.log(`유저가 ${joinRoomId}에 입장`);


    let userId = socket.decoded.userId;


    for (let roomId of Object.keys(roomData)) {
      console.log(roomId);
      let room = roomData[roomId];
      if (roomData[roomId] == undefined) {
        continue;
      }
      let flag = false;
      roomData[roomId].users = roomData[roomId].users.map((user) => {
        if (user.userData.userId == userId && user.live == true) {
          user.live = false;
          flag = true;
        }
        return user;
      });

      socket.leave(roomId);

      io.to(roomId).emit('updateRoomInfo', {
        roomId: roomId,
        roomData: roomData[roomId]

      });



      let liveCount = 0;
      for (let user of roomData[roomId].users) {
        if (user.live == true) {
          liveCount++;
        }
      }

      if (liveCount == 0) {
        delete roomData[roomId];
      }

    }


    if (roomData[joinRoomId] == undefined) {
      roomData[joinRoomId] = {

        host: socket.id,
        users: [
          {
            "userData": userData[socket.id],
            "live": true,
          }
        ],
      };
    } else {

      let isAlreadyExist = false;

      for (let user of roomData[joinRoomId].users) {
        if (user.userData.userId == userId) {
          user.live = true;
          isAlreadyExist = true;
        }
      }

      if (isAlreadyExist == false) {
        roomData[joinRoomId].users.push({
          "userData": userData[socket.id],
          "live": true,
        });
      }


    }


    io.to(joinRoomId).emit('updateRoomInfo', {
      roomId: joinRoomId,
      roomData: roomData[joinRoomId]

    });

    io.to(joinRoomId).emit('new message', 'system', {
      icon: '👏',
      message: `${userData[socket.id].nickname}님이 들어왔어요.`,
    }, new Date().toTimeString());

    socket.join(joinRoomId);
    socket.emit('updateRoomInfo', {
      roomId: joinRoomId,
      roomData: roomData[joinRoomId]

    });
  });

  socket.on('send message', (userId, roomId, message) => {
    console.log(`${userId}: ${message}, ${roomId}`);
    // addMessage(roomId, userId, message, (result) => {
    io.to(roomId).emit('new message', userId, message, new Date().toTimeString());
    // });
  });

  socket.on('leave room', (userId, roomId) => {
    updateRead(roomId, userId);
    socket.leave(roomId);
    console.log('나가기');
  })


  socket.on('hostTimestamp', (roomId, timestamp) => {
    if (roomData[roomId] == undefined || roomData[roomId].host != socket.id) {
      return;
    }
    // console.log('hostTimestamp', roomId, timestamp);
    io.to(roomId).emit('hostTimestamp', timestamp);
  });

  socket.on('videoAt', (roomId, timestamp) => {
    if (roomData[roomId] == undefined || roomData[roomId].host != socket.id) {
      return;
    }
    console.log('videoAt', roomId, timestamp);
    io.to(roomId).emit('videoAt', { "videoAt": timestamp });
  });

  socket.on('videoToggle', (roomId, toggleType) => {
    if (roomData[roomId] == undefined || roomData[roomId].host != socket.id) {
      return;
    }
    roomData[roomId].isPlaying = toggleType == 'play' ? true : false;
    io.to(roomId).emit('updateRoomInfo', {
      roomId: roomId,
      roomData: roomData[roomId]

    });
    socket.broadcast.to(roomId).emit('videoToggle', { "type": toggleType });
  });

  socket.on("setSpeed", (roomId, speed) => {
    if (roomData[roomId] == undefined || roomData[roomId].host != socket.id) {
      return;
    }
    roomData[roomId].speed = speed;
    io.to(roomId).emit('updateRoomInfo', {
      roomId: roomId,
      roomData: roomData[roomId]
    });
  });


  socket.on('disconnect', () => {
    console.log('유저 연결 끊김');

    let userId = socket.decoded.userId;
    let roomId = null;


    for (let roomId of Object.keys(roomData)) {
      console.log(roomId);
      let room = roomData[roomId];
      if (roomData[roomId] == undefined) {
        continue;
      }


      let tempHost = roomData[roomId].host;
      // roomData[roomId].users = roomData[roomId].users.filter((user) => {
      //   return user.userId != userId;
      // }
      // );

      let flag = false;
      roomData[roomId].users = roomData[roomId].users.map((user) => {
        if (user.userData.userId == userId) {
          user.live = false;
          flag = true;
        }
        return user;
      });

      if (flag == false) {
        continue;
      } else {

        socket.leave(roomId);

        io.to(roomId).emit("new message",
          'system', {
          icon: '❗',
          message: `${userData[socket.id].nickname}님이 나갔어요.`,
        }, new Date().toTimeString())

        let liveCount = 0;
        for (let user of roomData[roomId].users) {
          if (user.live == true) {
            liveCount++;
          }
        }

        if (liveCount == 0) {
          delete roomData[roomId];
        } else {
          console.log(tempHost, userId);
          if (tempHost == socket.id) {
            roomData[roomId].host = roomData[roomId].users[0].socketId;
            io.to(roomId).emit('updateRoomInfo', {
              roomId: roomId,
              roomData: roomData[roomId]
            });

            io.to(roomId).emit("new message",
              'system', {
              icon: '👍',
              message: `${userData[roomData[roomId].host].nickname}님이 방장이 되었어요.`,
            }, new Date().toTimeString())
          }

          io.to(roomId).emit('updateRoomInfo', {
            roomId: roomId,
            roomData: roomData[roomId]

          });

        }
      }





    }




  });
});

httpServer.listen(port, () => {
  console.log("서버 시작");
})
