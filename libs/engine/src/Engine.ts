/* eslint-disable @typescript-eslint/no-unused-vars */
import removeAccents from 'remove-accents';
import shuffle from 'shuffle-array';

import { LetterAlreadySuggestedError, WordAlreadySuggestedError } from './errors';
import words from './words';

// TODO: Fix bugs
class Engine {
  private static readonly TRIALS = 5;

  public players: string[];

  public trials: number;

  public letterHistory: string[] = [];

  public wordHistory: string[] = [];

  public word: string;

  public partialWord: string;

  private currentPlayerIndex = 0;

  public constructor(players: string[], trials: number = Engine.TRIALS) {
    this.players = players;
    this.trials = trials;

    const random = Math.floor(Math.random() * words.length);
    this.word = removeAccents(words[random]).toUpperCase();

    this.partialWord = [...this.word]
      .map((letter) => (letter.match(/[a-zA-Z]/) ? '_' : letter)).join('');

    this.players = shuffle(this.players);
  }

  public gameState(): number {
    if (this.partialWord === this.word) { return 1; }
    if (this.trials === 0) { return -1; }
    return 0;
  }

  public getCurrentPlayer(): string {
    return this.players[this.currentPlayerIndex];
  }

  public nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    if (this.currentPlayerIndex === 0) {
      this.trials -= 1;
    }
  }

  public checkInput(input: string): string {
    this.validateInput(input);
    const capitalized = input.toUpperCase();

    if (capitalized.length === 1) {
      this.letterHistory.push(capitalized);
      return this.checkLetter(capitalized);
    }

    this.wordHistory.push(capitalized);
    return this.checkWord(capitalized);
  }

  private validateInput(input: string): void {
    if (this.letterHistory.includes(input)) {
      throw new LetterAlreadySuggestedError();
    }

    if (this.wordHistory.includes(input)) {
      throw new WordAlreadySuggestedError();
    }
  }

  private checkWord(word: string): string {
    if (word === this.word) {
      this.partialWord = word;
      return word;
    }

    return this.partialWord;
  }

  private checkLetter(letter: string): string {
    const indices = this.getIndicesForLetter(letter);

    indices.forEach((i) => {
      const newPartialWord = [...this.partialWord];
      newPartialWord[i] = this.word[i];
      this.partialWord = newPartialWord.join('');
    });

    return this.partialWord;
  }

  private getIndicesForLetter(letter: string): number[] {
    const res: number[] = [];

    for (let i = 0; i < this.word.length; i += 1) {
      const l = this.word[i];
      if (l === letter) {
        res.push(i);
      }
    }

    return res;
  }
}

export default Engine;
