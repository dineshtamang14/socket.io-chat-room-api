const app = require('express')();
const http = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(http);
const {addUser, getUser, removeUser} = require('./helper');
const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('create-room', name=>{
        console.log('the room name is', name);
    });
    socket.on('join', ({name, room_id, user_id}) => {
        const {error, user} = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id 
        });
        if(error){
            console.log('join error', error);
        } else {
            console.log('joined user', user);
        }
    })
    socket.on('sendMessage', (mesage, room_id, callback) => {
        const user = getUser(socket.id);
        const msgToStore = {
            name:user.name,
            user_id: user.user_id,
            room_id,
            text: mesage
        }
        console.log("mesage", msgToStore);
        io.to(room_id).emit('message', msgToStore);
        callback();
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});