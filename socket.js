const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { redisClient, pubClient, subClient } = require("./redis");

function initializeSocket(io) {
    
    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", async (socket) => {

        await redisClient.set(`user:${socket.user.id}`, socket.id);
        console.log(`User Id${socket.user.id}`);


        socket.join(socket.user.country);

        if(socket?.user.role === 'Admin'){
            socket.join('admin-support-room');
        }

        socket.on('join-support-room', (roomId) => {
            socket.join(roomId);
        });

        socket.on("test", (data) => {
            io.emit("test-response", data)
        })


        socket.on("withdraw-request-accepted-req", (data) => {
            io.to(data?.country).emit("withdraw-request-accepted-res", data)
        })


        socket.on("disconnect", async () => {
            try {
                await redisClient.del(`user:${socket.user.id}`);
                console.log(`Removed user:${socket.user.id} from Redis`);
            } catch (err) {
                console.error(`Error removing user from Redis: ${err.message}`);
            }

            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

module.exports = initializeSocket;
