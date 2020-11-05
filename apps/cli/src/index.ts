/* eslint-disable no-console */
import scanf from 'scanf';
import Engine, { LetterAlreadySuggestedError, WordAlreadySuggestedError } from '@hanged-man/engine';

const promptPlayersAmount = (): number => {
  console.log('Combien de joueurs ?');
  let amount = 0;

  do {
    amount = scanf('%d\n') as unknown as number;
  }
  while (amount < 1 || amount > 4);

  return amount;
};

const promptPlayersName = (amount: number): string[] => {
  const names: string[] = [];
  for (let i = 0; i < amount; i += 1) {
    console.log(`Entrez le nom du joueur ${i + 1}`);
    const name = scanf('%s\n').toString();

    names.push(name);
  }

  return names;
};

const promptTrials = (): number | undefined => {
  console.log("Combien d'essais ? (laisser vide pour 15)");
  const answer = scanf('%d\n') as unknown as number;
  return (answer === 0)
    ? undefined
    : answer;
};

const promptLetterOrWord = (): string => {
  console.log('Propose une lettre ou un mot :');
  return scanf('%S\n').toString();
};

const showAnnouncement = (engine: Engine): void => {
  console.log(`${engine.getCurrentPlayer()}, c'est à toi de jouer`);
  console.log(`Le mot : ${engine.partialWord}`);
};

const handleError = (error: unknown): void => {
  if (error instanceof LetterAlreadySuggestedError
      || error instanceof WordAlreadySuggestedError) {
    console.log(error.message);
  }
};

const main = () => {
  const amount = promptPlayersAmount();
  const names = promptPlayersName(amount);
  const trials = promptTrials();

  const engine = new Engine(names, trials);

  while (engine.gameState() === 0) {
    showAnnouncement(engine);

    const input = promptLetterOrWord();
    console.clear();

    try {
      engine.checkInput(input);
    } catch (error: unknown) {
      handleError(error);
    }

    if (engine.gameState() === 0) {
      engine.nextPlayer();
    }
  }

  const message = (engine.gameState() === -1)
    ? `Perdu, le mot était : ${engine.word}`
    : `Bravo ${engine.getCurrentPlayer()}, tu as gagné !`;

  console.log(message);
};

main();
