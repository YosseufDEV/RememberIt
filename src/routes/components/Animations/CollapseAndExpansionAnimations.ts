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
     return gsap.fromTo(children, 
            { top: `-${maxWidth}px`, opacity: 0, duration: ANIMATION_DURATION, delay: 0,},
            { top: "0px", 
              opacity: 1, 
              position: "relative", 
              duration: ANIMATION_DURATION, 
              delay: 0,
              zIndex: 1,
              ease: "power2.out"
            }
        )
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
            .to(children, { position: "absolute" })
    return timeline;
}
