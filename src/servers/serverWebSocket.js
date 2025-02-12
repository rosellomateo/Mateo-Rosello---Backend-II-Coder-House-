import { Server } from "socket.io"

const webSocket = (server) => {
    let io = new Server(server)
    return io
}

export default webSocket