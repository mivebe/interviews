'use strict';

//   Handles the GSAP fade-in animation of the hero image.
//   Accepts a CSS selector and a callback fired on complete.

class FadeImage {
  /**
   * @param {string} selector  - CSS selector for the <img> element
   * @param {Function} onComplete - called when animation finishes
   */
  constructor(selector, onComplete = () => {}) {
    this.el = document.querySelector(selector);
    this.onComplete = onComplete;

    if (!this.el) {
      console.error(`FadeImage: element not found for selector "${selector}"`);
    }
  }

  /** Start the fade-in animation */
  play() {
    if (!this.el) return;

    gsap.to(this.el, {
      opacity: 1,
      duration: 2.2,
      ease: 'power2.out',
      onComplete: () => this.onComplete(),
    });
  }
}

//  Wraps a button DOM element.
//  Can show/hide itself and bind a click handler.

class Button {
  /**
   * @param {string} wrapperSelector - CSS selector for the wrapper div
   * @param {string} btnSelector     - CSS selector for the <button>
   * @param {Function} onClick       - called when button is clicked
   */
  constructor(wrapperSelector, btnSelector, onClick = () => {}) {
    this.wrapper = document.querySelector(wrapperSelector);
    this.btn = document.querySelector(btnSelector);
    this.onClick = onClick;

    if (this.btn) {
      this.btn.addEventListener('click', () => this.onClick());
    }
  }

  /** Reveal the button with a GSAP pop-in */
  show() {
    if (!this.wrapper) return;
    this.wrapper.classList.remove('hidden');

    gsap.fromTo(
      this.wrapper,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' },
    );
  }

  /** Hide the button */
  hide() {
    if (!this.wrapper) return;
    this.wrapper.classList.add('hidden');
  }
}

//  Manages loading and displaying a Spine skeleton
//  using the official @esotericsoftware/spine-player.

class SpineAnimation {
  /**
   * @param {string} containerId   - id of the DOM container (no #)
   * @param {string} wrapperSelector - CSS selector of the overlay wrapper
   * @param {Object} config        - spine-player config overrides
   */
  constructor(containerId, wrapperSelector, config = {}) {
    this.containerId = containerId;
    this.wrapper = document.querySelector(wrapperSelector);
    this.config = config;
    this.player = null;
  }

  /**
   * Show the overlay and (re-)initialise the Spine player.
   * The player is created fresh each time to guarantee playback starts.
   */
  show() {
    if (!this.wrapper) return;

    // Reveal overlay
    this.wrapper.classList.remove('hidden');
    gsap.fromTo(this.wrapper, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    // Clear any previous canvas so the player can re-initialise
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = '';

    // Build the spine-player config
    const defaultConfig = {
      /* 
         Public demo skeleton from the Spine examples repository.
         Uses the "Spineboy" character with "walk" as the default animation.
      */
      skelUrl: 'https://esotericsoftware.com/files/examples/4.1/spineboy/export/spineboy-pro.skel',
      atlasUrl: 'https://esotericsoftware.com/files/examples/4.1/spineboy/export/spineboy-pma.atlas',
      animation: 'walk',
      backgroundColor: '#1a1a2e',
      showControls: true,
      defaultMix: 0.3,
    };

    const mergedConfig = Object.assign({}, defaultConfig, this.config);

    // Instantiate spine-player
    // spine.SpinePlayer is injected globally by the CDN script
    try {
      this.player = new spine.SpinePlayer(this.containerId, mergedConfig);
    } catch (err) {
      console.error('SpineAnimation: failed to create player', err);
    }
  }

  /** Hide the overlay and destroy the player */
  hide() {
    if (!this.wrapper) return;

    gsap.to(this.wrapper, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.wrapper.classList.add('hidden');
        // Clear canvas to free GPU resources
        const container = document.getElementById(this.containerId);
        if (container) container.innerHTML = '';
        this.player = null;
      },
    });
  }
}

//  Orchestrates FadeImage → Button → SpineAnimation.

class App {
  constructor() {
    // 1. Spine animation instance
    this.spineAnim = new SpineAnimation('spine-player', '#spine-wrapper');

    // 2. Play button – shown after fade-in, triggers spine
    this.playButton = new Button('#btn-wrapper', '#play-btn', () => this.spineAnim.show());

    // 3. Close button inside spine overlay
    const closeBtn = document.querySelector('#close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.spineAnim.hide());
    }

    // 4. Fade-in image – when done, show the play button
    this.fadeImage = new FadeImage('#fade-image', () => this.playButton.show());
  }


  start() {
    this.fadeImage.play();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});
