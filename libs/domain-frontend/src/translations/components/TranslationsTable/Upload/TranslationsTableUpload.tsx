import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { WarningIcon } from '@chakra-ui/icons';
import {
  Dialog,
  FaIcon,
  readFileAsText,
  UploadInput,
  UploadInputProps,
} from '@skryba/shared-frontend';
import { Button } from '@chakra-ui/react';
import { UploadError } from '@skryba/shared';
import { useImport } from '../../../hooks/useImport';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export const TranslationsTableUpload = () => {
  const { fromRawText } = useImport();

  const closeDialogRef = useRef<HTMLButtonElement>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>();

  const handleUpload = useCallback<UploadInputProps['onFile']>(
    async (files) => {
      if (!files?.length) {
        return;
      }

      try {
        setLoading(true);

        const invalidFiles = files.filter((file) => file.type !== 'text/plain');

        if (invalidFiles.length) {
          setLoading(false);

          setError(
            new UploadError('Following files are not text files:', invalidFiles)
          );

          return;
        }

        const contents = await Promise.all(
          files.map((file) => readFileAsText(file))
        );

        await fromRawText(contents as string[]);
      } catch (error) {
        console.error(error);

        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [fromRawText]
  );

  return (
    <>
      <UploadInput
        accept="text/plain"
        id="upload_entries"
        clearAfterOnFile
        isLoading={loading}
        multiple
        onFile={handleUpload}
        leftIcon={<FaIcon icon={faUpload} />}
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
      </Dialog>
    </>
  );
};
