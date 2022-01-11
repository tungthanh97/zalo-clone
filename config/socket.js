const socket = (io) => {
    io.on('connect', (socket) => {
        // on user disconnect
        socket.on('disconnect', () => {
            socket.broadcast.emit(
                'notifyMessage',
                `${socket.username} has left the room`,
            );
        });
        // on user join
        socket.on('join', (username) => {
            console.log(`${username} has joined the room`);
            socket.username = username;
            socket.broadcast.emit('notifyMessage', `${username} has joined the room`);
        });
        // on message Send
        socket.on('sendMessage', (username, message) => {
            console.log(`${username}: ${message}`);
            io.emit('message', username, message);
        });
    });
};

module.exports = socket;