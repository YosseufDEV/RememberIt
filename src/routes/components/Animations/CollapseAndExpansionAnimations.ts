import gsap from "gsap";

const ANIMATION_DURATION = 0.2;

export function animateChevronOpened(chevron: HTMLElement) {
    gsap.to(chevron, {
        rotate: "0",
        duration: ANIMATION_DURATION
    })
}

export function animateChevronClosed(chevron: HTMLElement) {
    gsap.to(chevron, {
        rotate: "-90",
        duration: ANIMATION_DURATION
    })
}

export function expandCollection(children: HTMLElement, maxWidth: number) {
    let timeline = gsap.timeline();
    timeline
        .from(children, 
            { 
                top: `-${maxWidth}px`, 
                opacity: 0, 
                duration: ANIMATION_DURATION, 
                height: 0,
                position: "relative", 
            },
        )
        .to(children, 
            { 
                height: "auto",
                top: "0px", 
                opacity: 1, 
                position: "relative", 
                duration: ANIMATION_DURATION, 
                zIndex: 1,
                ease: "power2.out"
        }, "<");
    return timeline;
}

export function collapseCollection(collapsableParent: HTMLElement, children: HTMLElement, maxWidth: number) {
    let timeline = gsap.timeline();
    gsap.to(collapsableParent, {zIndex: 20000})
    timeline.
        to(children, 
            { 
                top: `-${maxWidth}px`, 
                duration: ANIMATION_DURATION, 
                zIndex: -1,
                ease: "power2.in",
                opacity: 0 
            })
        .to(children, {
            delay: 0.2,
            height: 0,
            duration: ANIMATION_DURATION,
        }, "<")
        .to(children, 
            { 
                position: "absolute" 
            })
    return timeline;
}
