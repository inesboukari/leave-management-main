let io;
/*  socket établir une communication bidirectionnelle et en temps réel entre le serveur et le client*/

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {cors: {origin: '*',}})
        return io
    },

    getIO: () => {
        if(!io){
            return res.status(400).send("socket.io not initialized")
        }
        return io
    }
}