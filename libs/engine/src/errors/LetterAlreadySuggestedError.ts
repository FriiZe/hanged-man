class LetterAlreadySuggestedError extends Error {
  public constructor() {
    super('Cette lettre a déjà été suggérée, tu perds ton tour !')
  }
}

export default LetterAlreadySuggestedError;
