import { gsap } from 'gsap';
import { Container } from 'pixi.js';
import { DEFAULT_EASE } from './config';

type TweenVars = GSAPTweenVars & { duration: number };

export function tweenAlpha(target: Container, alpha: number, vars: TweenVars): GSAPTween {
    return gsap.to(target, { alpha, ease: DEFAULT_EASE, overwrite: true, ...vars });
}

export function tweenScale(target: Container, scale: number, vars: TweenVars): GSAPTween {
    return gsap.to(target.scale, { x: scale, y: scale, ease: DEFAULT_EASE, overwrite: true, ...vars });
}

export function restartTimeline(current: GSAPTimeline | null, vars?: GSAPTimelineVars): GSAPTimeline {
    current?.kill();
    return gsap.timeline(vars);
}
