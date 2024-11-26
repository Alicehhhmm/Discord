import { NextApiRequest } from "next";
import { Server as NetServer } from "node:http";
import { Server as ServerIo } from "socket.io";

import { NextApiResponseServerIo } from "@/typings/type";

/**
 * 基础配置
 */
export const config = {
    api: {
        bodyParser: false,
    }
}

/**
 * 处理 socket.io 事件
 * @param req
 * @param res
 * 
*/
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {

    if (!res.socket.server.io) {
        const path = '/api/socket/io'
        const httpServer: NetServer = res.socket.server as any
        const io = new ServerIo(httpServer, {
            path: path,
            // @ts-ignore
            addTrailingSlashesWith: false  // 是否添加尾部斜杠
        });
        res.socket.server.io = io
    }

    res.end();
}

export default ioHandler;