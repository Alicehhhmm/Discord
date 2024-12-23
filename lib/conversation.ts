import { db } from '@/lib/db';



/**
 * 查找第一个对话
 * @param memberOneId 
 * @param memberTwoId 
 * @returns first conversation
 */
const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId },
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch {
        return null;
    }
}

/**
 * 创建成员对话
 * @param memberOneId 
 * @param memberTwoId 
 * @returns new conversation
 */
const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch {
        return null
    }
}

/**
 * 获取特定成员对话|没有测创建一个新的对话
 * @param memberOneId 当前用户memberId
 * @param memberTwoId 其他用户memberId
 * @returns any conversation
 */
export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)

    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId)
    }

    return conversation
}