class ImageWorker extends WorkerMessenger {
  constructor() {
    super("js/image-worker/index.js");
  }

  /**
   *
   * @param {ImageData} imagedata
   * @returns {Uint8ClampedArray}
   */
  convertImage(imagedata) {
    return this.requestResponse(imagedata.data, [imagedata.data.buffer]);
  }
}
