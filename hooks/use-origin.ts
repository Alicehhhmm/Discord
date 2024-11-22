import { useState, useEffect } from "react";

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    // 获取:当前窗口的原始URL（即协议、主机名和端口号）
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ''

    if (!mounted) {
        return ''
    }

    return origin
}