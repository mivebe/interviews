import { SYMBOL_IDS, SymbolId } from '../config';

export function randomSymbolId(): SymbolId {
    return SYMBOL_IDS[Math.floor(Math.random() * SYMBOL_IDS.length)];
}
