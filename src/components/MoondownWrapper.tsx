// src/components/MoondownWrapper.tsx
import React, { useRef, useEffect } from 'react';
import Moondown from '../moondown/moondown';

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
            editorInstance = new Moondown(containerRef.current, initialValue);
            onReady(editorInstance);
            isInitialized.current = true;
        }

        return () => {
            if (editorInstance) {
                editorInstance.destroy();
                isInitialized.current = false;
            }
        };
    }, []);

    return <div ref={containerRef} className="min-h-[300px] w-full" />;
};

export default MoondownWrapper;