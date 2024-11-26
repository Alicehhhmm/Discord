
import { NextApiResponse } from "next";
import { Server as SocketServer } from 'socket.io'
import { Server as NetServer, Socket } from 'node:net'
import { Server, Member, Profile } from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    Socket: Socket & {
        server: NetServer & {
            io: SocketServer
        }
    }
}