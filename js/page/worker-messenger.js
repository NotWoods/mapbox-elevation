// @ts-check
"use strict";

class WorkerMessenger {
  /**
   * @param {string} url
   */
  constructor(url) {
    /** @type {Map<number, [Function, Function]>} */
    this.pending = new Map();
    this.requestId = 0;
    this.url = url;
    this.worker = new Worker(this.url);
    this.worker.onmessage = event => this.onMessage(event);
  }

  async release() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    for (const key of this.pending.keys()) {
      this.fulfillPending(
        key,
        null,
        new Error("Worker terminated: " + this.url)
      );
    }
  }

  /**
   * @private
   * @param {{id:number,data:any}} message
   * @param {any[]} [transfer]
   */
  postMessage(message, transfer) {
    this.worker.postMessage(message, transfer);
  }

  /**
   * Event handler for worker responses
   * @private
   * @param {MessageEvent} event
   */
  onMessage(event) {
    const { id, result, error } = event.data;
    if (!id) {
      console.log("Unexpected message", event);
      return;
    }

    this.fulfillPending(id, result, error);
  }

  /**
   * @private
   * @param {number} id
   * @param {any} result
   * @param {any} error
   */
  fulfillPending(id, result, error) {
    const resolver = this.pending.get(id);

    if (!resolver) {
      console.log("No resolver for", { id, result, error });
      return;
    }

    this.pending.delete(id);

    if (error) {
      resolver[1](new Error(error));
    } else {
      resolver[0](result);
    }
  }

  /**
   * Send a message to the worker and await a response
   * @protected
   * @param {any} message
   * @param {any[]} [transfer]
   */
  requestResponse(message, transfer) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.pending.set(id, [resolve, reject]);
      this.postMessage({ id, data: message });
    });
  }
}
