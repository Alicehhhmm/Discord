import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { DirectMessage } from "@prisma/client";

/**
 * 获取批量消息记录数自定义
 * 当前默认返回：10 条
 */
const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url)

        // 获取URL上的参数
        const cursor = searchParams.get('cursor')
        const conversationId = searchParams.get('conversationId')

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!conversationId) {
            return new NextResponse("ConversationId ID messing", { status: 400 })
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH, //指定查询应该返回的最大记录数
                skip: 1, // 跳过查询结果中的第一条记录
                cursor: {
                    id: cursor, //指定查询的起始点
                },
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        // 2.下一个查询标识
        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (error) {
        console.log('[DIRECCT_MESSAGES_GET]' + error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}