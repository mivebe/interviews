import './styles.css';
import { Game } from './core/Game.js';

window.addEventListener('load', () => {
  const game = new Game();
  game.init().catch(err => console.error('Game init failed:', err));
});
