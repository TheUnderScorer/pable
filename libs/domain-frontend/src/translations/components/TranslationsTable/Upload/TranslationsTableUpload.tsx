import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { DownloadIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Dialog,
  readFile,
  UploadInput,
  UploadInputProps,
} from '@pable/shared-frontend';
import { Button, List, ListItem } from '@chakra-ui/react';
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
      >
        Upload
      </UploadInput>
      <Dialog
        title={
          <>
            <WarningIcon color="danger" mr={2} />
            Upload error
          </>
        }
        footer={
          <Button
            onClick={() => setError(null)}
            ref={closeDialogRef as MutableRefObject<HTMLButtonElement>}
          >
            Close
          </Button>
        }
        leastDestructiveRef={closeDialogRef}
        onClose={() => setError(null)}
        isOpen={Boolean(error)}
      >
        {error?.message}
        {error?.invalidFiles?.length && (
          <List mt={2}>
            {error.invalidFiles.map((file) => (
              <ListItem>{file.name}</ListItem>
            ))}
          </List>
        )}
      </Dialog>
    </>
  );
};
