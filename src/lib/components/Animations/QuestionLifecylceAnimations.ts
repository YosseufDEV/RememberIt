import gsap from "gsap";

export function newlyAddedQuestionAnimation(questionRef: HTMLElement) {
    const timeline = gsap.timeline();
    timeline
        .from(questionRef, {
            opacity: 0,
            height: 0,
            scale: 0.95,
        })
        .to(questionRef, {
            height: "auto",
            opacity: 0,
        }, "<")
        .to(questionRef, {
            // delay: 0.5,
            opacity: 1,
            scale: 1,
        });
}

export function deleteQuestionAnimation(questionRef: HTMLElement) {
    const timeline = gsap.timeline({ defaults: { duration: 0.3 } });
    timeline.to(questionRef, {
        autoAlpha: 0,
        margin: 0,
        padding: 0,
    }).to(questionRef, {
        delay: 0.2,
        margin: 0,
        padding: 0,
        height: 0,
        onComplete: () => {
            questionRef.remove();
        }
    }, "<")
    return timeline;
}
