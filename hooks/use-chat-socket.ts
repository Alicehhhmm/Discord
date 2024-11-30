import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";

import { useSocket } from "@/components/provider/socket-provider";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};

/**
 * 获取：实时加载的消息
 * @method useChatSocket
 * @return 最新的socket消息
 */
export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey,
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        // 旧数据更新
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        }),
                    };
                });

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        // 新增消息
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [
                            {
                                items: [message],
                            },
                        ],
                    };
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [message, ...newData[0].items],
                };

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [queryClient, addKey, queryKey, socket, updateKey]);
};