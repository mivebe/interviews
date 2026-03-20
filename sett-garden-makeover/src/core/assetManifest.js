// Models
import level from '../assets/models/level.glb?url';
import animalPen from '../assets/models/animal_pen.glb?url';
import seedbeds from '../assets/models/seedbeds.glb?url';
import cow from '../assets/models/cow.glb?url';
import sheep from '../assets/models/sheep.glb?url';
import chicken from '../assets/models/chicken.glb?url';
import furniture from '../assets/models/furniture.glb?url';
import strawberry from '../assets/models/strawberry.glb?url';
import corn from '../assets/models/corn.glb?url';
import tomato from '../assets/models/tomato.glb?url';
import grape from '../assets/models/grape.glb?url';

// Audio
import music from '../assets/audio/music.mp3?url';
import confirm from '../assets/audio/confirm.mp3?url';
import cowSound from '../assets/audio/cow.mp3?url';
import sheepSound from '../assets/audio/sheep.mp3?url';
import chickenSound from '../assets/audio/chicken.mp3?url';
import hammering from '../assets/audio/hammering.mp3?url';
import shovel from '../assets/audio/shovel.mp3?url';
import click from '../assets/audio/click.mp3?url';
import returnSound from '../assets/audio/return.mp3?url';
import packshot from '../assets/audio/packshot.mp3?url';

// Images
import introImg from '../assets/images/intro.png?url';
import arrowImg from '../assets/images/arrow.png?url';
import checkmarkImg from '../assets/images/checkmark.png?url';
import logoImg from '../assets/images/logo.png?url';
import playImg from '../assets/images/play.png?url';
import soundOnImg from '../assets/images/soundOn.png?url';
import soundOffImg from '../assets/images/soundOff.png?url';
import frameImg from '../assets/images/frame.png?url';
import plusImg from '../assets/images/plus.png?url';
import cursorImg from '../assets/images/cursor.png?url';
import cowIcon from '../assets/images/cow.png?url';
import sheepIcon from '../assets/images/sheep.png?url';
import chickenIcon from '../assets/images/chicken.png?url';
import tableIcon from '../assets/images/table.png?url';
import cartIcon from '../assets/images/cart.png?url';
import swingIcon from '../assets/images/swing.png?url';
import tomatoIcon from '../assets/images/tomato.png?url';
import strawberryIcon from '../assets/images/strawberry.png?url';
import grapesIcon from '../assets/images/grapes.png?url';
import cornIcon from '../assets/images/corn.png?url';

// Effects
import swashJson from '../assets/effects/swash.json';
import swashPng from '../assets/effects/swash.png?url';
import smokePuffJson from '../assets/effects/smoke_puff.json';
import smokePuffPng from '../assets/effects/smoke_puff.png?url';

export const ASSETS = {
  models: {
    level,
    AnimalPen: animalPen,
    SeedBed: seedbeds,
    cow_asset: cow,
    sheep_asset: sheep,
    chicken_asset: chicken,
    furniture_asset: furniture,
    strawberry,
    corn,
    tomato,
    grape,
  },
  audio: {
    music: { src: music, loop: true, volume: 0 },
    confirm: { src: confirm, volume: 0.3 },
    cow: { src: cowSound, volume: 0.3 },
    sheep: { src: sheepSound, volume: 0.3 },
    chicken: { src: chickenSound, volume: 0.3 },
    hammering: { src: hammering, volume: 1.0 },
    shovel: { src: shovel, volume: 0.3 },
    click: { src: click, volume: 0.3 },
    return: { src: returnSound, volume: 0.3 },
    packshot: { src: packshot, volume: 0.3 },
  },
  images: {
    intro: introImg,
    arrow: arrowImg,
    checkmark: checkmarkImg,
    logo: logoImg,
    play: playImg,
    soundOn: soundOnImg,
    soundOff: soundOffImg,
    frame: frameImg,
    plus: plusImg,
    cursor: cursorImg,
    // Icon lookup by filename (used by constants.js item.icon)
    'cow.png': cowIcon,
    'sheep.png': sheepIcon,
    'chicken.png': chickenIcon,
    'table.png': tableIcon,
    'cart.png': cartIcon,
    'swing.png': swingIcon,
    'tomato.png': tomatoIcon,
    'strawberry.png': strawberryIcon,
    'grapes.png': grapesIcon,
    'corn.png': cornIcon,
  },
  effects: {
    swash: { json: swashJson, image: swashPng },
    smoke_puff: { json: smokePuffJson, image: smokePuffPng },
  },
};
