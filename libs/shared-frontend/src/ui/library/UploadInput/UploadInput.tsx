import { Button, ButtonProps } from '@chakra-ui/react';
import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useRef,
} from 'react';

export interface UploadInputProps extends Omit<ButtonProps, 'onClick'> {
  onFile?: (files: FileList | null) => unknown;
  multiple?: boolean;
  clearAfterOnFile?: boolean;
}

export const UploadInput = ({
  children,
  onFile,
  multiple,
  clearAfterOnFile,
  ...props
}: PropsWithChildren<UploadInputProps>) => {
  const uploadRef = useRef<HTMLInputElement>();

  const handleClick = useCallback(() => {
    uploadRef.current?.click();
  }, []);

  return (
    <>
      <input
        id={props.id ? `${props.id}_upload` : undefined}
        multiple={multiple}
        onChange={(event) => {
          onFile?.(event.target.files);

          if (clearAfterOnFile) {
            uploadRef.current.value = '';
          }
        }}
        type="file"
        style={{
          display: 'none',
        }}
        ref={uploadRef as MutableRefObject<HTMLInputElement>}
      />
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>
    </>
  );
};
