import gsap from "gsap";

export function mutateTagToBadgeAnimation(tagContainerRef: HTMLElement, tagCircleRef: HTMLElement) {
    const timeline = gsap.timeline();
    timeline
        .to(tagContainerRef, {
            background: `${tagCircleRef.style.background}`,
            padding: "3px 12px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        })
        .to(tagCircleRef, {
            width: 0,
            height: 0,
            marginRight: 0,
        }, "<");
    return timeline;
}
