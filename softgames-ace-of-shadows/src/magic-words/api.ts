const MAGIC_WORDS_URL = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

export interface Emoji {
  name: string;
  url: string;
}

export interface Avatar {
  name: string;
  url: string;
  position: 'left' | 'right';
}

export interface DialogueLine {
  name: string;
  text: string;
}

/** Raw API response uses "emojies" (not "emojis") */
interface RawMagicWordsResponse {
  emojies: Emoji[];
  avatars: Avatar[];
  dialogue: DialogueLine[];
}

export interface MagicWordsResponse {
  emojis: Emoji[];
  avatars: Avatar[];
  dialogue: DialogueLine[];
}

/** Fetch dialogue data from the mock API. Normalizes the "emojies" typo in the raw response to "emojis". */
export async function fetchMagicWords(): Promise<MagicWordsResponse> {
  const response = await fetch(MAGIC_WORDS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch magic words: ${response.status}`);
  }
  const raw: RawMagicWordsResponse = await response.json();
  return {
    emojis: raw.emojies,
    avatars: raw.avatars,
    dialogue: raw.dialogue,
  };
}
