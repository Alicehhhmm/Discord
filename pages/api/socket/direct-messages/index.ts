
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/typings/type';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';

/**
 * 获取一对一聊天消息服务
 * @method POST
 * @return res: NextApiResponseServerIo
 */
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
        const { conversationId } = req.query

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!conversationId) {
            return res.status(400).json({ error: 'conversation ID messing' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content  messing' });
        }

        // 1.查找一对一对话列表
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                }
            },
        })

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // 2.取反：判断当前用户所属对话
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        // 3.综上条件：创建新的一对一聊天消息列表
        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
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

        // 4. 推送消息到该频道（channelKey）的聊天室
        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }

}
