export function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
}

export function clamp01(value: number): number {
    return clamp(value, 0, 1);
}

export function easeInQuad(t: number): number {
    return t * t;
}

export function easeOutQuad(t: number): number {
    return t * (2 - t);
}

export function bumpPulse(t: number): number {
    return Math.sin(clamp01(t) * Math.PI);
}
