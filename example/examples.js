import preLoader from '..';

const normal = () =>{

  // assign 50 non-cache-able images via an image generator
  const imagesArray = new Array(10).join(',').split(',').map((el, i) => 'images/dummy.jpg?' + Date.now() + i);

  // uncomment to see error handling.
  // imagesArray.push('404img.jpg');

  // create a HTML5 progress element
  const progress = document.createElement('progress');
  progress.setAttribute('max', imagesArray.length);
  progress.setAttribute('value', 0);
  const target = document.querySelector('div.container');
  target.appendChild(progress);

  const legend = document.createElement('span');
  target.appendChild(legend);

  // instantiate the pre-loader with an onProgress and onComplete handler
  new preLoader(imagesArray, {
    // pipeline: true,
    cacheBurst: true,
    onProgress: function(img, imageEl, index){
      // fires every time an image is done or errors.
      // imageEl will be falsy if error
      console.log('just ' + (!imageEl ? 'failed: ' : 'loaded: ') + img);

      const percent = Math.floor((100 / this.queue.length) * this.completed.length);

      // update the progress element
      legend.innerHTML = '' + index + ' / ' + this.queue.length + ' (' + percent + '%)';
      progress.value = index;

      // can access any propery of this
      console.log(this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
    },
    onComplete: function(loaded, errors){
      // fires when whole list is done. cache is primed.
      console.log('done', loaded);

      if (errors){
        console.log('the following failed', errors);
      }
    },
    onError: function(bombed){
      console.log('error', bombed);
    }
  });

};


const parallel = () => {
  // assign 50 non-cache-able images via an image generator
  const imagesArray = new Array(10).join(',').split(',').map((el, i) => {
    // an actual dummy image generator online.
    return 'images/dummy.jpg?' + Date.now() + i;
  });

  // create a HTML5 progress element
  const progress = document.createElement('progress');
  progress.setAttribute('max', imagesArray.length);
  progress.setAttribute('value', 0);
  const target = document.querySelector('div.container');
  target.appendChild(progress);

  const legend = document.createElement('span');
  target.appendChild(legend);

  // instantiate the pre-loader with an onProgress and onComplete handler
  new preLoader(imagesArray, {
    pipeline: true,
    onProgress: function(img, imageEl, index){
      // fires every time an image is done or errors.
      // imageEl will be falsy if error
      console.log('just ' +  (!imageEl ? 'failed: ' : 'loaded: ') + img);

      const percent = Math.floor((100 / this.queue.length) * this.completed.length);

      // update the progress element
      legend.innerHTML = '' + index + ' / ' + this.queue.length + ' ('+percent+'%)';
      progress.value = index;

      // can access any propery of this
      console.log(this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
    },
    onComplete: function(loaded, errors){
      // fires when whole list is done. cache is primed.
      console.log('done', loaded);

      if (errors){
        console.log('the following failed', errors);
      }
    }
  });
};

const dom = () => {
  preLoader.lazyLoad();
};

export {
  normal,
  parallel,
  dom
};
