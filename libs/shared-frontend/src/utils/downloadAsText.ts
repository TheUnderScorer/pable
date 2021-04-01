import download from 'downloadjs';

export const downloadAsText = (text: string, fileName: string) => {
  const blob = new Blob([text], {
    type: 'type: "text/plain;charset=utf-8"',
  });

  download(blob, fileName);
};
