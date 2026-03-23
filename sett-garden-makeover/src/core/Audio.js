import { Howler } from 'howler';

export class Audio {
  constructor(sounds) {
    this.sounds = sounds;
    this.muted = false;
  }

  play(name) {
    if (!this.muted && this.sounds[name]) {
      const snd = this.sounds[name];
      snd.stop();
      snd.play();
    }
  }

  startMusic() {
    const music = this.sounds.music;
    music.volume(0);
    music.play();
    music.fade(0, 0.2, 350);
  }

  stopMusic() {
    const music = this.sounds.music;
    music.fade(music.volume(), 0, 1000);
  }

  mute() {
    this.muted = true;
    Howler.mute(true);
  }

  unmute() {
    this.muted = false;
    Howler.mute(false);
  }

  toggleMute() {
    if (this.muted) this.unmute();
    else this.mute();
    return this.muted;
  }
}
