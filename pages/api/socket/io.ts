import { NextApiRequest } from "next";
import { Server as NetServer } from "node:http";
import { Server as ServerIo } from "socket.io";

import { NextApiResponseServerIo } from "@/typings/type";

export const config = {
    api: {
        bodyParser: false,
    }
}

/**
 * socket.io Server implementation
 * socket.io 服务端, 处理事件
 * 注意：必须保证服务端、客户端的 path 一致
 * @param req
 * @param res 
 * @return NextResponse
*/
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {

    if (!res.socket.server.io) {
        const httpServer: NetServer = res.socket.server as any
        const io = new ServerIo(httpServer, {
            path: '/api/socket/io',
        });
        res.socket.server.io = io
    }

    res.end();
}

export default ioHandler;