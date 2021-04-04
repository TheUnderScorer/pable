import React, { useState } from 'react';
import { FileDropzone } from '@skryba/shared-frontend';
import { Box, Image } from '@chakra-ui/react';
import DragDocument from '../../../../assets/drag-document.png';
import { moveCursor } from './TranslateDocumentOnboardUploadPreview.styles';
import { useDebounce } from 'react-use';

export const TranslateDocumentOnboardUploadPreview = () => {
  const [fileDragged, setFileDragged] = useState(false);

  useDebounce(
    () => {
      if (fileDragged) {
        setFileDragged(false);
      }
    },
    3000,
    [fileDragged]
  );

  return (
    <Box
      p={2}
      pointerEvents="none"
      width="100%"
      backgroundColor="paper"
      boxShadow="inner"
      position="relative"
    >
      {!fileDragged && (
        <Image
          zIndex={2}
          position="absolute"
          animation={`${moveCursor} 1 1s forwards`}
          onAnimationEnd={() => {
            setFileDragged(true);
          }}
          src={DragDocument}
          sx={{}}
        />
      )}
      <FileDropzone buttonProps={{ isLoading: fileDragged }} width="100%" />
    </Box>
  );
};
