import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/provider/socket-provider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

/**
 * 通过调用该方法，触发消息情况API接口
 * @param apiUrl 触发AIP的APP路由路径
 * @method fetchMessages 触发消息路由服务，获取消息
 * @returns data 过滤后的接口参数 
 */
export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
}: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam,
                    [paramKey]: paramValue,
                },
            },
            { skipNull: true }
        );

        const res = await fetch(url);
        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: [queryKey],
            queryFn: ({ pageParam }: any) => fetchMessages(pageParam),
            getNextPageParam: (lastPage) => lastPage?.nextCursor,
            refetchInterval: isConnected ? false : 1000,
            initialPageParam: 1,
        });


    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
};