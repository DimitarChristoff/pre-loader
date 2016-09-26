/**
 * Internal checker on the queue progress
 * @param {String} src
 * @param {Object} image
 * @returns {PreLoader}
 * @private
 */
function _checkProgress(src, image){
  // intermediate checker for queue remaining. not exported.
  // called on preLoader instance as scope
  const args = [],
    o = this.options;

  // call onProgress
  o.onProgress && src && o.onProgress.call(this, src, image, this.completed.length);

  if (this.completed.length + this.errors.length === this.queue.length){
    args.push(this.completed);
    this.errors.length && args.push(this.errors);
    o.onComplete.apply(this, args);
  }

  return this;
}


// can we support addEventListener
const hasNative = 'addEventListener' in (new Image());

/**
 * @constructor
 * @param {Array} images - string of images to load
 * @param {Object=} options - overrides to defaults
 */
class PreLoader {

  options = {
    pipeline: false,
    auto: true,
    prefetch: false,
    /* onProgress: function(){}, */
    /* onError: function(){}, */
    onComplete: function(){}
  };

  constructor(images, options = {}){
    Object.assign(this.options, options);
    this.addQueue(images);
    this.queue.length && this.options.auto && this.processQueue();
  }

  /**
   * stores a local array, dereferenced from original
   * @param images
   * @returns {PreLoader}
   */
  addQueue(images){
    this.queue = images.slice();

    return this;
  }

  /**
   * reset the arrays
   * @returns {PreLoader}
   */
  reset(){
    this.completed = [];
    this.errors = [];

    return this;
  }

  /**
   * Subscribe to events for an imag object and a source
   * @param {Object} image
   * @param {String} src
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  _addEvents(image, src, index){
      const self = this,
        o = this.options,
        cleanup = function(){
          if (hasNative){
            this.removeEventListener('error', abort);
            this.removeEventListener('abort', abort);
            this.removeEventListener('load', load);
          }
          else {
            this.onerror = this.onabort = this.onload = null;
          }
        },
        abort = function(){
          cleanup.call(this);

          self.errors.push(src);
          o.onError && o.onError.call(self, src);
          _checkProgress.call(self, src);
          o.pipeline && self._loadNext(index);
        },
        load = function(){
          cleanup.call(this);

          // store progress. this === image
          self.completed.push(src); // this.src may differ
          _checkProgress.call(self, src, this);
          o.pipeline && self._loadNext(index);
        };

      if (hasNative){
        image.addEventListener('error', abort, false);
        image.addEventListener('abort', abort, false);
        image.addEventListener('load', load, false);
      }
      else {
        image.onerror = image.onabort = abort;
        image.onload = load;
      }

      return this;
  }

  /**
   * Private API to load an image
   * @param {String} src
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  _load(src, index){
    const image = new Image;

    this._addEvents(image, src, index);

    // actually load
    image.src = src;

    return this;
  }

  /**
   * Move up the queue index
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  _loadNext(index){
    // when pipeline loading is enabled, calls next item
    index++;
    this.queue[index] && this._load(this.queue[index], index);

    return this;
  }

  /**
   * Iterates through the queue of images to load
   * @returns {PreLoader}
   */
  processQueuefunction(){
    // runs through all queued items.
    const queue = this.queue;
    const len = queue.length;

    let i = 0;

    // process all queue items
    this.reset();

    if (!this.options.pipeline) for (; i < len; ++i) this._load(queue[i], i);
    else this._load(queue[0], 0);

    return this;
  }

  /**
   * Static method that loads images lazily from DOM based upon data-preload attribute
   * @param {Object} options= optional options to pass to PreLoader
   * @returns {PreLoader} instance
   */
  static lazyLoad(options){
    if (!options)
      options = {};

    const lazyImages = document.querySelectorAll(options.selector || 'img[data-preload]');
    const l = lazyImages.length
    const toLoad = [];

    let i = 0, oldProgress;

    for (; i < l; i++) toLoad.push(lazyImages[i].getAttribute('data-preload'));

    options.onProgress && (oldProgress = options.onProgress);
    options.onProgress = function(item, imgEl, index){
      lazyImages[index - 1].src = item;
      lazyImages[index - 1].removeAttribute('data-preload');
      oldProgress && oldProgress.apply(this, arguments);
    };

    return toLoad.length ? new PreLoader(toLoad, options) : null;
  };

}

export default PreLoader;
