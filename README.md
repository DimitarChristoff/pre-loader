pre-loader
==========

Event-driven sequential image preloading in vanilla js.


## Basic use

Load an array, get a functional callback when done:

```javascript
new preLoader(['image1.jpg', 'http://domain.com/image2.jpg'], function(loaded, errors){
	console.log('cache primed with:', loaded);
	errors && errros.length && console.log('these failed:', errors);
});
```

## Progress reporting

Loading an array of images, firing a callback with each one and in the end:

```
new preLoader([
	'image1.jpg',
	'http://domain.com/image2.jpg'
], function(src, element, index){
	if (element){
		console.log|('loaded ' + src);
		// gets optional reference to element you can use:
		// document.appendChild(element);
	}
	else {
		console.log('failed ' + src);
	}

	// output some stats
	var donePercent = Math.floor((100 / this.queue.length) * this.completed.length);
	console.log(donePercent + '% completed', this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
}, function(loaded, errors){
	console.log('cache primed with:', loaded);
	errors && errros.length && console.log('these failed:', errors);
});
```

For more info, see the `example/index.html` file or look at [http://jsfiddle.net/dimitar/mFQm6/](http://jsfiddle.net/dimitar/mFQm6/)
