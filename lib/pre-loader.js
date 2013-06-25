(function(){
	'use strict';

	var preLoader = function(images, /*optional callback*/progress, /*function*/complete){
		// set callbacks
		if (!complete){
			// shift
			complete = progress || function(){};
			progress = null;
		}

		this.onComplete = complete;
		this.onProgress = progress;

		this.addQueue(images);
		this.queue.length && this.processQueue();
	};

	preLoader.prototype.addQueue = function(images){
		// stores a local array, dereferenced from original
		this.queue = images.slice();

		return this;
	};

	preLoader.prototype.reset = function(){
		// reset the arrays
		this.completed = [];
		this.errors = [];

		return this;
	};

	preLoader.prototype.load = function(src){
		var image = new Image(),
			self = this;

		// set some event handlers
		image.onerror = image.onabort = function(){
			this.onerror = this.onabort = this.onload = null;

			self.errors.push(src);
			checkProgress.call(self, src);
		};

		image.onload = function(){
			this.onerror = this.onabort = this.onload = null;

			// store progress. this === image
			self.completed.push(src); // this.src may differ
			checkProgress.call(self, src, this);
		};

		// actually load
		image.src = src;

		return this;
	};

	preLoader.prototype.processQueue = function(){
		// runs through all queued items.
		var i = 0,
			queue = this.queue,
			len = queue.length;

		// process all queue items
		this.reset();

		for (; i < len; ++i)
			this.load(queue[i], i);

		return this;
	};

	function checkProgress(src, image){
		// intermediate checker for queue remaining. not exported.
		// called on preLoader instance as scope
		var args = [];

		if (this.onProgress && src){
			this.onProgress.call(this, src, image, this.completed.length);
		}

		if (this.completed.length + this.errors.length === this.queue.length){
			args.push(this.completed);
			this.errors.length && args.push(this.errors);
			this.onComplete.apply(this, args);
		}

		return this;
	}


	if (typeof define === 'function' && define.amd){
		// we have an AMD loader.
		define(function(){
			return preLoader;
		});
	}
	else {
		this.preLoader = preLoader;
	}
}).call(this);