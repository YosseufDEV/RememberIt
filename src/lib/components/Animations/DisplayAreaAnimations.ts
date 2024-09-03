import gsap from "gsap";

const PAGE_ANIMATION_DURATION = 0.15;
export function entranceAnimation(containerRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: PAGE_ANIMATION_DURATION } });
    timeline.from(containerRef, {
        delay: 0,
        autoAlpha: 0,
        translateY: 250,
        ease: "power4.out"
    }).to(containerRef, {
        autoAlpha: 1,
        translateY: 0,
        ease: "power4.out"
    })
    return timeline;
}

export function exitingAnimation(containerRef: HTMLElement, callback: GSAPCallback) {
    const timeline = gsap.timeline({ defaults: { duration: PAGE_ANIMATION_DURATION } });
    timeline.to(containerRef, {
        autoAlpha: 0,
        translateY: 100,
        ease: "power4.in",
        onComplete: callback
    })
    return timeline;
}

export function colorOverlayAnimation(overlay: HTMLElement, color: string, opacity: number) {
    const timeline = gsap.timeline();
    timeline.to(overlay, {
        background: color,
        autoAlpha: opacity
    })
    return timeline;
}
