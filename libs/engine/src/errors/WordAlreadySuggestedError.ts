class WordAlreadySuggestedError extends Error {
  public constructor() {
    super('Ce mot a déjà été suggéré, tu perds ton tour !');
  }
}

export default WordAlreadySuggestedError;
