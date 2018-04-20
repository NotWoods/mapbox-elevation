importScripts("./calc.js");

self.onmessage = event => {
  const { id, data } = event.data;
  try {
    const result = convertImage(data);
    self.postMessage({ id, result }, [result.buffer]);
  } catch (error) {
    self.postMessage({ id, error });
  }
};
