export interface SimulateTypingParams {
  word: string;
  delayMs?: number;
  onType: (word: string, letter: string, currentIndex: number) => void;
}

export const simulateTyping = ({
  word,
  delayMs = 1000,
  onType,
}: SimulateTypingParams) => {
  return new Promise<void>((resolve) => {
    let result = '';
    let currentIndex = 0;

    const writeText = () => {
      if (result === word) {
        resolve();

        return;
      }

      const letter = word[currentIndex];
      result += letter;

      currentIndex++;

      onType(result, letter, currentIndex);

      setTimeout(writeText, delayMs);
    };

    writeText();
  });
};
