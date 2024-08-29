import gsap from "gsap";


const ANIMATION_DURATION = 0.3;

export function removeBadgeAnimation(badgeRef: HTMLElement, strikeThroughRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: ANIMATION_DURATION } });

    timeline.from(badgeRef, {
        scale: 1,
        webkitFilter: "brightness(1)",
    }).to(badgeRef, {
        scale: 0.95,
        webkitFilter: "brightness(0.75)",
    }, "<")
    .from(strikeThroughRef, {
        delay: 0.2,
        height: "2px",
        borderRadius: "500px",
        background: "#404040",
    }, "<")
    .to(strikeThroughRef, {
        position: "absolute",
        height: "2px",
        borderRadius: "500px",
        width: "89px",
        background: "#404040",
        duration: 0.5,
    }, "<")
    .to(badgeRef, {
        webkitFilter: "brightness(0.75)",
        opacity: 0,
    }).to(badgeRef, {
        marginRight: 0,
        padding: 0,
        delay: 0.5,
        width: 0,
    }, "<")
    .to(badgeRef, {
        webkitFilter: "brightness(0.75)",
        position: "absolute",
    }, ">");
}
