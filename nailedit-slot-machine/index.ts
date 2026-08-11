import { Application, Assets, Container, Sprite } from 'pixi.js';
import { Machine } from './src/Machine';
import { SlotGame } from './src/SlotGame';
import { SpinButton } from './src/SpinButton';
import { WinPresenter } from './src/WinPresenter';
import { BUTTON_POSITION, REEL_WINDOW, SCREEN } from './src/config';
import { AssetEntry, urls } from './img';

class MainScene extends Container {
    private readonly _game: SlotGame;

    constructor() {
        super();

        const background = Sprite.from('background');
        background.width = SCREEN.width;
        background.height = SCREEN.height;
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(SCREEN.width * 0.5, SCREEN.height * 0.5);
        this.addChild(reels);

        const machine = new Machine();
        machine.position.set(
            reels.x - reels.width * 0.5 + REEL_WINDOW.offsetX,
            reels.y - reels.height * 0.5 + REEL_WINDOW.offsetY
        );
        this.addChild(machine);

        const winPresenter = new WinPresenter(machine);
        winPresenter.position.copyFrom(machine.position);
        this.addChild(winPresenter);

        const spinButton = new SpinButton();
        spinButton.position.set(BUTTON_POSITION.x, BUTTON_POSITION.y);
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
        const scale = Math.min(
            this._app.renderer.width / SCREEN.width,
            this._app.renderer.height / SCREEN.height
        );
        this._scene.scale.set(scale);
        this._scene.position.set(
            (this._app.renderer.width - SCREEN.width * scale) * 0.5,
            (this._app.renderer.height - SCREEN.height * scale) * 0.5
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
        main.update(Math.min(ticker.deltaMS, 100) / 1000);
    });
})();
