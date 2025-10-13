// src/components/MoondownWrapper.tsx
import React, { useRef, useEffect } from 'react';
import Moondown from '../moondown-editor/moondown'; // 直接从我们创建的目录导入

interface MoondownWrapperProps {
    initialValue?: string;
    onReady: (instance: Moondown) => void;
}

const MoondownWrapper: React.FC<MoondownWrapperProps> = ({ initialValue = '', onReady }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        let editorInstance: Moondown | null = null;

        if (containerRef.current && !isInitialized.current) {
            // 初始化 Moondown 编辑器
            editorInstance = new Moondown(containerRef.current, initialValue);

            // 通过回调将实例传递给父组件
            onReady(editorInstance);

            isInitialized.current = true;
        }

        // 组件卸载时销毁编辑器实例，防止内存泄漏
        return () => {
            if (editorInstance) {
                editorInstance.destroy();
                isInitialized.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 空依赖数组确保 effect 只运行一次

    return <div ref={containerRef} className="border rounded-md shadow-sm min-h-[300px] w-full" />;
};

export default MoondownWrapper;