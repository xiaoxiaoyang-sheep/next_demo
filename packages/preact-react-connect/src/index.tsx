import { ComponentType, render, h as hp, type Attributes } from "preact";
import React, { type ReactNode, useEffect, useRef } from "react";

type CommonPreactComponentProps = {
    setChildrenContainer?: (ele: HTMLElement) => void;
};

export function connect<P extends CommonPreactComponentProps>(
    component: ComponentType<P>
) {
    const Component = (props: any) => {
        const containerRef = useRef<HTMLDivElement | null>(null)
        const childrenContainerRef = useRef<HTMLElement | null>(null);

        useEffect(() => {
            if(containerRef.current) {
                render(
                    hp(component, {
                        ...props,
                    } as unknown as P & Attributes),
                    containerRef.current
                );
            }
        }, [props])

        return <div ref={containerRef}></div>
    }
    return Component
}