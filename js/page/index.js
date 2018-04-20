// @ts-check
const source = /** @type {HTMLImageElement} */ (document.getElementById(
  "source"
));
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
  "canvas"
));
const ctx = canvas.getContext("2d");

const image = new ImageWorker();

async function format() {
  const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await image.convertImage(imagedata);
  console.log(buffer);
  const newdata = new ImageData(buffer, imagedata.width, imagedata.height);
  ctx.putImageData(newdata, 0, 0);
}

function main() {
  canvas.height = source.height;
  canvas.width = source.width;
  ctx.drawImage(source, 0, 0);
  return format();
}

if (source.complete) main();
else source.onload = main;
