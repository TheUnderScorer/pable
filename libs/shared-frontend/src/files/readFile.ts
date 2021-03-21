export const readFile = (
  file: File,
  readSource: (reader: FileReader, file: File) => unknown
) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('error', reject);
    reader.addEventListener('load', (data) => {
      resolve(data.target.result);
    });

    readSource(reader, file);
  });
};
