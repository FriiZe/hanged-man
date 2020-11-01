/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import scanf from 'scanf';
import shuffle from 'shuffle-array';

class Engine {
  private static readonly TRIALS = 15;

  public players: string[];

  public trials: number;

  public letterHistory: string[];

  public wordHistory: string[];

  public word: string;

  public partialWord: string;

  public constructor(players: string[], trials: number = Engine.TRIALS) {
    this.players = players;
    this.trials = trials;

    const words = fs.readFileSync('./liste.txt', 'utf-8')
      .toString()
      .split('\n');

    const random = Math.floor(Math.random() * words.length);
    this.word = words[random];

    this.partialWord = [...this.word].map((_letter) => '_').join('');

    this.players = shuffle(this.players);
  }

  public getLetter(letter: string): string {
    const indices = this.getIndicesForLetter(letter);

    indices.forEach((i) => {
      const newPartialWord = [...this.partialWord];
      newPartialWord[i] = this.word[i];
      this.partialWord = newPartialWord.join();
    });

    return this.partialWord;
  }

  public isFinished(): boolean {
    return this.partialWord === this.word;
  }

  public isWordCorrect(word: string): boolean {
    return word === this.word;
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
