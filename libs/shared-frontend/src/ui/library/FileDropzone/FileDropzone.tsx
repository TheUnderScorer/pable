import React, { PropsWithChildren } from 'react';
import { FaIcon } from '../FaIcon/FaIcon';
import { UploadInput, UploadInputProps } from '../UploadInput/UploadInput';
import { Text } from '@chakra-ui/react';
import {
  faUpload,
  faFileImport,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { first } from 'remeda';

export interface FileDropzoneProps
  extends Pick<
    UploadInputProps,
    'onFile' | 'accept' | 'width' | 'height' | 'multiple'
  > {
  buttonProps?: Omit<UploadInputProps, 'onFile'>;
}

interface FileDropResult {
  files: File[];
}

export const FileDropzone = ({
  onFile,
  buttonProps,
  accept,
  width = '50%',
  height = 225,
  multiple,
}: PropsWithChildren<FileDropzoneProps>) => {
  const [{ canDrop, isOver }, ref] = useDrop<
    FileDropResult,
    void,
    { canDrop: boolean; isOver: boolean }
  >({
    accept: [NativeTypes.FILE],
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: (item) => {
      onFile?.(multiple ? item.files : [first(item.files)]);
    },
    canDrop: (item) => {
      return item.files.every((file) => file.type === accept);
    },
  });

  return (
    <UploadInput
      multiple={multiple}
      ref={ref}
      onFile={onFile}
      accept={accept}
      borderStyle="dashed"
      borderWidth={canDrop ? '3px' : '2px'}
      borderColor={canDrop ? 'primary' : 'gray'}
      bg="lightGrey"
      width={width}
      height={height}
      flexDirection="column"
      clearAfterOnFile
      {...buttonProps}
    >
      {
        <>
          {!canDrop && (
            <>
              <Text mb={8}>Drag and drop text file here or click</Text>
              <FaIcon fontSize="3xl" icon={faUpload} />
            </>
          )}
          {canDrop && !isOver && (
            <>
              <Text mb={8}>Drag file here</Text>
              <FaIcon fontSize="3xl" icon={faFile} />
            </>
          )}
          {canDrop && isOver && (
            <>
              <Text mb={8}>Drop file here</Text>
              <FaIcon fontSize="3xl" icon={faFileImport} />
            </>
          )}
        </>
      }
    </UploadInput>
  );
};
