import { ComponentType, render, h as hp, type Attributes } from "preact";
import { Teleport, defineComponent, h as hv, ref, watchEffect } from "vue";

type CommonPreactComponentProps = {
    setChildrenContainer: (ele: HTMLElement) => void;
};

export function connect<P extends CommonPreactComponentProps>(
    component: ComponentType<P>
) {
    return defineComponent<P>({
        inheritAttrs: false,
        setup(props, { attrs, slots }) {
            const containerRef = ref();
            const childrenContainerRef = ref();

            watchEffect(() => {
                if (containerRef.value) {
                    render(
                        hp(component, {
                            ...attrs,
                            setChildrenContainer: (ele: HTMLElement) => {
                                childrenContainerRef.value = ele;
                            },
                        } as unknown as P & Attributes),
                        containerRef.value
                    );
                }
            });

            return () =>
                hv("div", { ref: containerRef }, [
                    childrenContainerRef.value
                        ? hv(Teleport, { to: childrenContainerRef.value }, [
                              slots.default?.(),
                          ])
                        : null,
                ]);
        },
    });
}