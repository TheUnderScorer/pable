import React, {
  AnimationEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box } from '@chakra-ui/react';
import {
  DocumentToDisplay,
  TranslateDocumentStore,
  useTranslateDocumentStore,
} from '../../../stores/useTranslateDocumentStore';
import { useDebounce, useEvent, useMount, useUnmount } from 'react-use';
import { TranslatedDocumentContent } from '../../TranslatedDocument/Content/TranslatedDocumentContent';
import { wait } from '@skryba/shared';
import { ReactComponent as Cursor } from '../../../../assets/cursor.svg';
import { chakra } from '@chakra-ui/system';
import {
  moveCursorToWord,
  toggleTranslation,
} from './TranslateDocumentOnboardDocumentPreview.styles';

const CursorComponent = chakra(Cursor);

const initialState: Partial<TranslateDocumentStore> = {
  file: {
    size: 0,
    name: 'Document.txt',
  },
  display: DocumentToDisplay.Translated,
  fileContent: 'Kocham gołębie. Paulina jest super.',
  translatedContent: [
    'Kocham ',
    {
      id: 'pigeon',
      translation: {
        targetWord: 'szczypiorek',
      },
      word: 'gołębie',
    },
    '. Paulina jest ',
    {
      id: 'super',
      translation: {
        targetWord: 'sjuper',
      },
      word: 'super',
    },
  ],
};

export const TranslateDocumentOnboardDocumentPreview = () => {
  const prevStoreState = useMemo(
    () => useTranslateDocumentStore.getState(),
    []
  );

  const containerRef = useRef<HTMLDivElement | undefined>();

  const [animation, setAnimation] = useState(moveCursorToWord);
  const [finished, setFinished] = useState(false);

  const handleAnimationEnd = useCallback<AnimationEventHandler>(
    async (event) => {
      switch (event.nativeEvent.animationName) {
        case moveCursorToWord.name: {
          const trigger = containerRef.current?.querySelector<HTMLButtonElement>(
            '.translated-entry-trigger'
          );

          trigger?.focus();

          await wait(500);

          trigger?.click();

          await wait(2000);

          setAnimation(toggleTranslation);

          await wait(400);

          break;
        }

        case toggleTranslation.name: {
          const action = containerRef.current?.querySelector<HTMLButtonElement>(
            '.document-entry-action'
          );

          action?.focus();

          await wait(500);

          action?.click();

          await wait(500);

          setFinished(true);
        }
      }
    },
    []
  );

  useMount(() => {
    useTranslateDocumentStore.setState({
      ...prevStoreState,
      ...initialState,
    });
  });

  useUnmount(() => {
    useTranslateDocumentStore.setState(prevStoreState);
  });

  useEvent('beforeunload', () => {
    useTranslateDocumentStore.setState(prevStoreState);
  });

  useDebounce(
    () => {
      if (finished) {
        useTranslateDocumentStore.setState({
          ...prevStoreState,
          ...initialState,
        });

        setAnimation(moveCursorToWord);

        setFinished(false);
      }
    },
    5000,
    [finished]
  );

  return (
    <Box
      ref={containerRef}
      p={4}
      pointerEvents="none"
      width="100%"
      backgroundColor="paper"
      boxShadow="inner"
      position="relative"
      sx={{
        '.translated-document-sidebar': {
          height: '100%',
          minHeight: '300px',
        },
      }}
    >
      <Box
        zIndex={999}
        animation={`${animation} 1 1s forwards`}
        position="absolute"
        width="40px"
        onAnimationEnd={handleAnimationEnd}
      >
        <CursorComponent width="100%" />
      </Box>
      <TranslatedDocumentContent />
    </Box>
  );
};
