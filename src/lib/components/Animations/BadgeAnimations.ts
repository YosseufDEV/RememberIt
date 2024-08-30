import gsap from "gsap";

export function badgeTapAnimation(badgeRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: 0.3 } });
    timeline.to(badgeRef, {
        scale: 0.92,
    }).to(badgeRef, {
        scale: 1,
    })
}

export function badgeTapOutAnimation(badgeRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: 0.3 } });
    timeline.to(badgeRef, {
        scale: 1.1,
    }).to(badgeRef, {
        scale: 1,
    })
}

export function explanationAppearAnimation(explanationContainerRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: 0.4, zIndex: 10000 } });
    timeline.from(explanationContainerRef, {
        top: 0,
        scaleX: 0.5,
        scaleY: 1.5,
    })
    .to(explanationContainerRef, {
        autoAlpha: 1,
        delay: 0.2,
        top: "-35px",
        scaleY: 1,
    }, "<").to(explanationContainerRef, {
        scaleY: 0.6,
        scaleX: 1.5,
    }, "<")
    .to(explanationContainerRef, {
        scaleX: 1,
        scaleY: 1,
    }, "<")
    return timeline;
}


export function explanationDisappearAnimation(explanationContainerRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: 0.2, zIndex: 10000 } });
    timeline.to(explanationContainerRef, {
        scaleX: 0.7,
        scaleY: 0.9,
        autoAlpha: 0,
        top: "-10px",
    })
    return timeline;
}

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
