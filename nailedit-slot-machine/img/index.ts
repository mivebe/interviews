export interface AssetEntry {
    alias: string;
    src: string;
}

export const urls: readonly AssetEntry[] = Object.freeze([
    { alias: 'background', src: new URL('./background.jpg', import.meta.url).href },
    { alias: 'reels_base', src: new URL('./reels_base.png', import.meta.url).href },
    { alias: 'high1', src: new URL('./high1.png', import.meta.url).href },
    { alias: 'high2', src: new URL('./high2.png', import.meta.url).href },
    { alias: 'high3', src: new URL('./high3.png', import.meta.url).href },
    { alias: 'low1', src: new URL('./low1.png', import.meta.url).href },
    { alias: 'low2', src: new URL('./low2.png', import.meta.url).href },
    { alias: 'low3', src: new URL('./low3.png', import.meta.url).href },
    { alias: 'low4', src: new URL('./low4.png', import.meta.url).href },
    { alias: 'spin_btn_normal', src: new URL('./spin_btn_normal.png', import.meta.url).href },
    { alias: 'spin_btn_hover', src: new URL('./spin_btn_hover.png', import.meta.url).href },
    { alias: 'spin_btn_over', src: new URL('./spin_btn_over.png', import.meta.url).href },
    { alias: 'spin_btn_down', src: new URL('./spin_btn_down.png', import.meta.url).href },
    { alias: 'spin_btn_disabled', src: new URL('./spin_btn_disabled.png', import.meta.url).href }
]);
