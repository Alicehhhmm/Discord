
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/typings/type';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await currentProfilePages(req)
        const { content, fileUrl } = req.body
        const { serverId, channelId } = req.query

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!serverId) {
            return res.status(400).json({ error: 'Server ID messing' });
        }

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID messing' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content  messing' });
        }

        // 1.查找当前消息第一个服务
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true
            }
        })

        if (!server) {
            return res.status(404).json({ message: 'Server not found' })
        }

        // 2.查找当前消息第一个频道
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        })

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' })
        }

        // 3.查找当前服务，是否比配当前成员
        const member = server.members.find((member) => member.profileId === profile.id)

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        // 4.综上条件：创建新的聊天消息列表
        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        // 5. 推送消息到该频道（channelKey）的聊天室
        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }

}
