import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

// 开发模式：防止热更新影响
export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = db
}