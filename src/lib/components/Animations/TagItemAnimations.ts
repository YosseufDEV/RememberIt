import gsap from "gsap";

export function mutateTagToBadgeAnimation(tagContainerRef: HTMLElement, tagCircleRef: HTMLElement, countRef: HTMLElement) {
    const timeline = gsap.timeline();
    timeline
        .to(tagContainerRef, {
            background: `${tagCircleRef.style.background}`,
            padding: "5px 15px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }, "<")
        .to(countRef, {
            width: 0,
            height: 0,
            autoAlpha: 0,
            marginRight: 0,
        }, "<")
        .to(tagCircleRef, {
            width: 0,
            height: 0,
            marginRight: 0,
        }, "<");
    return timeline;
}
