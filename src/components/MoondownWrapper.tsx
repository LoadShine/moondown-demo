// src/components/MoondownWrapper.tsx
import React, { useRef, useEffect } from 'react';
import Moondown from '../moondown/moondown'; // Import directly from our created directory

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
            // Initialize Moondown editor
            editorInstance = new Moondown(containerRef.current, initialValue);

            // Pass instance to parent component via callback
            onReady(editorInstance);

            isInitialized.current = true;
        }

        // Destroy editor instance when component unmounts to prevent memory leaks
        return () => {
            if (editorInstance) {
                editorInstance.destroy();
                isInitialized.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures effect runs only once

    return <div ref={containerRef} className="border rounded-md shadow-sm min-h-[300px] w-full" />;
};

export default MoondownWrapper;