import { gsap } from 'gsap';
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { Machine } from './src/Machine';
import { SlotGame } from './src/SlotGame';
import { SpinButton } from './src/SpinButton';
import { WinPresenter } from './src/WinPresenter';
import { BUTTON, GRID, SCREEN } from './src/config';
import { AssetEntry, urls } from './img';

const { width: screenWidth, height: screenHeight, maxFrameDelta } = SCREEN;
const { offsetX, offsetY } = GRID;

class MainScene extends Container {
    private readonly _game: SlotGame;

    constructor() {
        super();

        const background = Sprite.from('background');
        background.width = screenWidth;
        background.height = screenHeight;
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(screenWidth * 0.5, screenHeight * 0.5);
        this.addChild(reels);

        const machine = new Machine();
        machine.position.set(
            reels.x - reels.width * 0.5 + offsetX,
            reels.y - reels.height * 0.5 + offsetY
        );
        this.addChild(machine);

        const winPresenter = new WinPresenter(machine);
        winPresenter.position.copyFrom(machine.position);
        this.addChild(winPresenter);

        const spinButton = new SpinButton();
        spinButton.position.set(BUTTON.x, BUTTON.y);
        this.addChild(spinButton);

        this._game = new SlotGame(machine, spinButton, winPresenter);
    }

    update(deltaSeconds: number): void {
        this._game.update(deltaSeconds);
    }
}

class Game {
    private _app!: Application;
    private _scene: Container | null = null;

    async initialize(app: Application, assetUrls: readonly AssetEntry[]): Promise<void> {
        this._app = app;
        await Assets.load(assetUrls.map((entry) => ({ alias: entry.alias, src: entry.src })));
    }

    setScene(scene: Container): void {
        this._app.stage.removeChildren();
        this._app.stage.addChild(scene);
        this._scene = scene;
        this.resize();
    }

    resize(): void {
        if (!this._scene) {
            return;
        }
        const { width, height } = this._app.renderer;
        const scale = Math.min(width / screenWidth, height / screenHeight);

        this._scene.scale.set(scale);
        this._scene.position.set(
            (width - screenWidth * scale) * 0.5,
            (height - screenHeight * scale) * 0.5
        );
    }
}

(async () => {
    const app = new Application();
    await app.init({
        background: 0x000000,
        resizeTo: window,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1
    });
    document.body.appendChild(app.canvas);

    const game = new Game();
    await game.initialize(app, urls);

    const main = new MainScene();
    game.setScene(main);

    app.renderer.on('resize', () => game.resize());

    app.ticker.add((ticker) => {
        main.update(gsap.utils.clamp(0, maxFrameDelta, ticker.deltaMS / 1000));
    });
})();
