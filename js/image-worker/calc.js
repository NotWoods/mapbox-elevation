// @ts-check

/**
 * Terrain-RGB uses each color channel as a position in a base-256 numbering
 * system, allowing for 16,777,216 unique values. Once you receive the tiles,
 * you will need to get the red (R), green (G), and blue (B) values for
 * individual pixels.
 *
 * The following equation will decode pixel values to height values. The height
 * will be returned in meters.
 * @param {number} R
 * @param {number} G
 * @param {number} B
 */
function heightInMeters(R, G, B) {
  return -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
}

/**
 * Yields height in meters for each pixel in the 1D array
 * @param {Uint8ClampedArray} imagedata
 */
function* imageMeters(imagedata) {
  for (let i = 0; i < imagedata.length; i += 4) {
    const r = imagedata[i];
    const g = imagedata[i + 1];
    const b = imagedata[i + 2];

    yield heightInMeters(r, g, b);
  }
}

/**
 * Normalizes RGB heights into values from 0-255. 0 will be the lowest height
 * in the image, and 255 will be the highest. Yields each Value (as in HSV) of
 * the new image.
 * @param {Uint8ClampedArray} imagedata
 */
function* normalizeHeights(imagedata) {
  const heights = new Uint8Array(imagedata.length / 4);

  let lowest = Number.POSITIVE_INFINITY;
  let highest = 0;

  let i = 0;
  for (const pixel of imageMeters(imagedata)) {
    heights[i] = pixel;

    if (pixel < lowest) lowest = pixel;
    if (pixel > highest) highest = pixel;

    i++;
  }

  const diff = highest - lowest;
  for (const height of heights) {
    yield Math.round((height - lowest) / diff);
  }
}

/**
 * @param {Uint8ClampedArray} imagedata
 */
function convertImage(imagedata) {
  let i = 0;
  for (const val of normalizeHeights(imagedata)) {
    imagedata[i] = val;
    imagedata[i + 1] = val;
    imagedata[i + 2] = val;
    imagedata[i + 3] = 255;

    i += 4;
  }
  return imagedata;
}
