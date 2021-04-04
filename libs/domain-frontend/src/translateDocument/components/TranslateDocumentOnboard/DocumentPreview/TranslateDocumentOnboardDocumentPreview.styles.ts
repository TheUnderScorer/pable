import { keyframes } from '@emotion/react';

export const moveCursorToWord = keyframes`
  0% {
    top: 50px;
    left: 50px
  }

  60% {
    top: 50px;
    left: 50px
  }

  100% {
    left: 100px;
    top: 100px;
  }
`;

export const toggleTranslation = keyframes`
  0% {
    left: 100px;
    top: 100px;
  }

  60% {
    left: 100px;
    top: 100px;
  }

  100% {
    left: 125px;
    top: 200px;
  }
`;
