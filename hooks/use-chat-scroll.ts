import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
};

/**
 * 消息框：滚动条相关事件
 * 监听滚动条，触发相关事件更新数据
 * @param chatRef 消息框
 * @param bottomRef 尾部标记
 * @param shouldLoadMore 是否显示更多
 * @param loadMore 加载更多
 * @param count 当前消息队列长度
 */
export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    // 1.当前滚动条位置：置顶
    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };

        topDiv?.addEventListener("scroll", handleScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        };
    }, [shouldLoadMore, loadMore, chatRef]);

    // 2.当前滚动条位置：置于最底部
    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;
        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [bottomRef, chatRef, count, hasInitialized]);
};