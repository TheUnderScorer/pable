import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { DownloadIcon, WarningIcon } from '@chakra-ui/icons';
import {
  readFile,
  UploadInput,
  UploadInputProps,
} from '@pable/shared-frontend';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  List,
  ListItem,
} from '@chakra-ui/react';
import { UploadError } from '@pable/shared';
import { useImport } from '../../../hooks/useImport';

export const TranslationsTableUpload = () => {
  const { fromRawText } = useImport();

  const closeDialogRef = useRef<HTMLButtonElement>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UploadError | null>();

  const handleUpload = useCallback<UploadInputProps['onFile']>(
    async (files) => {
      if (!files?.length) {
        return;
      }

      setLoading(true);

      const filesArray = Array.from(files);

      const invalidFiles = filesArray.filter(
        (file) => file.type !== 'text/plain'
      );

      if (invalidFiles.length) {
        setLoading(false);

        setError(
          new UploadError('Following files are not text files:', invalidFiles)
        );

        return;
      }

      const contents = await Promise.all(
        filesArray.map((file) =>
          readFile(file, (reader, fileToRead) => reader.readAsText(fileToRead))
        )
      );

      fromRawText(contents as string[]);

      setLoading(false);
    },
    [fromRawText]
  );

  return (
    <>
      <UploadInput
        clearAfterOnFile
        isLoading={loading}
        multiple
        onFile={handleUpload}
        leftIcon={<DownloadIcon transform="rotate(180deg)" />}
        variant="outline"
        colorScheme="primaryScheme"
      >
        Upload
      </UploadInput>
      <AlertDialog
        leastDestructiveRef={closeDialogRef}
        onClose={() => setError(null)}
        isOpen={Boolean(error)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader display="flex" alignItems="center">
              <WarningIcon color="danger" mr={2} />
              Upload error
            </AlertDialogHeader>
            <AlertDialogBody>
              {error?.message}
              {error?.invalidFiles?.length && (
                <List mt={2}>
                  {error.invalidFiles.map((file) => (
                    <ListItem>{file.name}</ListItem>
                  ))}
                </List>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={() => setError(null)}
                ref={closeDialogRef as MutableRefObject<HTMLButtonElement>}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
