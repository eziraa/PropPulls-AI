'use client'

import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-select';
import { Copy } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';

interface Props {
    className?: string;
    children?: React.ReactNode;
    copyContentRef?: React.RefObject<HTMLElement | null>;
}

const Debugger = ({ className, children, copyContentRef }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const resizerRefs = {
        bottomRight: useRef<HTMLDivElement>(null),
        right: useRef<HTMLDivElement>(null),
        bottom: useRef<HTMLDivElement>(null),
    };

    const [coppied, setCoppied] = useState(false);

    const [isDraggable, setIsDraggable] = useState(true);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const onMouseDownDrag = (e: MouseEvent) => {
            if (!isDraggable || (e.target as HTMLElement).classList.contains('resizer')) return;
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMoveDrag);
            document.addEventListener('mouseup', onMouseUpDrag);
        };

        const onMouseMoveDrag = (e: MouseEvent) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        };

        const onMouseUpDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMoveDrag);
            document.removeEventListener('mouseup', onMouseUpDrag);
        };

        element.addEventListener('mousedown', onMouseDownDrag);

        // Resizing
        const setupResize = (
            resizer: HTMLDivElement | null,
            direction: 'right' | 'bottom' | 'bottomRight'
        ) => {
            if (!resizer) return;

            let isResizing = false;
            let startX = 0;
            let startY = 0;
            let startWidth = 0;
            let startHeight = 0;

            const onMouseDownResize = (e: MouseEvent) => {
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = element.offsetWidth;
                startHeight = element.offsetHeight;
                document.addEventListener('mousemove', onMouseMoveResize);
                document.addEventListener('mouseup', onMouseUpResize);
            };

            const onMouseMoveResize = (e: MouseEvent) => {
                if (!isResizing) return;

                if (direction === 'right' || direction === 'bottomRight') {
                    const newWidth = startWidth + (e.clientX - startX);
                    element.style.width = `${newWidth}px`;
                }
                if (direction === 'bottom' || direction === 'bottomRight') {
                    const newHeight = startHeight + (e.clientY - startY);
                    element.style.height = `${newHeight}px`;
                }
            };

            const onMouseUpResize = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMoveResize);
                document.removeEventListener('mouseup', onMouseUpResize);
            };

            resizer.addEventListener('mousedown', onMouseDownResize);
        };

        setupResize(resizerRefs.bottomRight.current, 'bottomRight');
        setupResize(resizerRefs.right.current, 'right');
        setupResize(resizerRefs.bottom.current, 'bottom');

        return () => {
            element.removeEventListener('mousedown', onMouseDownDrag);
        };
    }, [isDraggable]);

    // UseEffect to handle copy content
    useEffect(() => {
        if (coppied) {
            const timer = setTimeout(() => {
                setCoppied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [coppied]);


    // Copy content to clipboard
    const copyToClipboard = () => {
        if (copyContentRef && copyContentRef.current) {
            const range = document.createRange();
            range.selectNode(copyContentRef.current);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
            document.execCommand('copy');
            window.getSelection()?.removeAllRanges();
            setCoppied(true);
        }
    };

    return (
        <div
            ref={ref}
            className={`fixed inset-10 border h-[60vh] w-[30vw] border-accent-950/70 p-2 rounded-lg left-8 top-8 bg-white flex flex-col z-[5000] items-center justify-center ${isDraggable ? 'cursor-move' : ''} ${className}`}
            style={{ minWidth: '300px', minHeight: '100px' }}
        >
            <div className="w-full max-w-full  h-full flex flex-col  rounded-lg shadow-lg relative">
                <div className="flex p-2 bg-accent-100  justify-between items-center w-full">
                    <h2 className="text-lg font-bold">Debugger</h2>
                    {copyContentRef && <Button
                        onClick={copyToClipboard}
                        className="text-xs relative px-2 py-1 mr-2 hover:cursor-pointer bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <Copy className="w-4 h-4 mr-1" />
                        {coppied ? 'Copied!' : 'Copy'}


                    </Button>}

                    <Button
                        onClick={() => setIsDraggable(prev => !prev)}
                        className="text-xs px-2 py-1 mr-2 hover:cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isDraggable ? 'Disable Drag' : 'Enable Drag'}
                    </Button>
                </div>
                <p className="text-sm text-gray-600">Drag or resize me!</p>

                <Separator className="my-2" />
                <div className="flex-1 w-full  text-sm max-w-full h-full overflow-auto flex bg-slate-800 text-slate-100 items-stretch justify-stretch">
                    {children}
                </div>
            </div>

            {/*  Separator */}

            {/* Resizers */}
            <div
                ref={resizerRefs.bottomRight}
                className="resizer w-3 h-3 bg-gray-500 absolute bottom-0 right-0 cursor-se-resize"
                style={{ zIndex: 10 }}
            />
            <div
                ref={resizerRefs.right}
                className="resizer w-2 h-full bg-gray-400/50 absolute top-0 right-0 cursor-e-resize"
                style={{ zIndex: 9 }}
            />
            <div
                ref={resizerRefs.bottom}
                className="resizer h-2 w-full bg-gray-400/50 absolute bottom-0 left-0 cursor-s-resize"
                style={{ zIndex: 9 }}
            />
        </div>
    );
};

export default Debugger;