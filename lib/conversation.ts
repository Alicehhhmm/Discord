import { db } from '@/lib/db';



/**
 * 查找第一个对话
 * @param memberOneId 
 * @param memberTwoId 
 * @returns first conversation
 */
const findCoversation = async (memberOneId: string, memberTwoId: string) => {
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
const createNewCoversation = async (memberOneId: string, memberTwoId: string) => {
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
export const getOrCreateCoversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findCoversation(memberOneId, memberTwoId) || await findCoversation(memberTwoId, memberOneId)

    if (!conversation) {
        conversation = await createNewCoversation(memberOneId, memberTwoId)
    }

    return conversation
}