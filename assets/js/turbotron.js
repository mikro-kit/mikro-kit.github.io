// name: turbotron
// description: Turbotron carousel for infinite slides
// version: 2.0
// repo: ??
// author: Timo Schuhmacher
// mail: t.schuhmacher@gmail.com
var turbotron = (function() {
  'use strict';
  //////////////////////
  // Variables
  //////////////////////

  // Constants
  var myTurbotronObjects = document.querySelectorAll('.turbotron-slide');
  var Inner = document.getElementById('turbotron-inner');
  //var indicators = document.querySelectorAll('.turbotron-indicators-fill');
  //var captionBox = document.querySelectorAll('.turbotron-caption-box')[0];
  var turbotronLength = myTurbotronObjects.length;
  var baseOffset = Math.round(10000 / turbotronLength) / 100;
  var offsets = [0];

  // Variables
  var slide = 1;
  var oldSlide = 0;
  var click = true;
  var prevDirection = 1;
  var translateX = 0;

  // Variables for touch
  var draggingPic = false;
  var currentX = 0;
  var posX = 0;
  var posstartX = 0;
  var startX = 0;
  var triggerTreshold = 0;

  // Variables to resize
  var thresholdValue = 0.05;
  var imageWidth = 0;
  var threshold = 0;

  //////////////////////
  // Functions
  //////////////////////

  // Begin with init and resize
  function init() {
    offsets = Array.apply(null, {length: turbotronLength}).map(function(value, index) {
      return (index - 1) * -1 * baseOffset;
    });
    Inner.style.width = turbotronLength * 100 + '%';
    Inner.style.left = offsets[slide] + '%';
    console.log(offsets);
    addEventListeners();
  }

  //////////////////////
  // moved by click - functions
  //////////////////////
  function changeSlide() {
    //console.log('changeSlide');
    slide = (slide + turbotronLength + 1 * prevDirection) % turbotronLength;
    console.log('chhangeSlide slide: ' + slide);
    window.requestAnimationFrame(moveSlide);
  }

  function moveSlide() {
    //console.log('moveSlide');
    Inner.style.transitionDuration = '.4s';
    Inner.style.transform = 'translate(' + offsets[slide] + '%, 0%)';
    // captionBox.style.transform = 'translate(' + translateCaption[slide] + '%, 0%)';
    // indicators[oldSlide].style.opacity = '0';
    // indicators[slide].style.opacity = '1';
    Inner.addEventListener('transitionend', checkSlide, false);
  }

  function checkSlide() {
    if (slide == 0) {
      console.log('if slide: ' + slide);
      switchSlide(false);
    } else if (slide == turbotronLength - 1) {
      console.log('else if slide: ' + slide);
      switchSlide(true);
    } else {
      console.log('else');
      endTransition();
    }
  }

  function endTransition() {
    console.log('endTransition');
    click = true;
    Inner.removeEventListener('transitionend', checkSlide, false);
  }

  function switchSlide(forward) {
    console.log('switchSlide');
    if (forward) {
      slide = 0;
    } else {
      slide = turbotronLength - 1 ;
    }
    console.log('switchSlide slide: ' + slide);
    Inner.style.transitionDuration = '0s';
    Inner.style.transform = 'translate(' + offsets[slide] + '%, 0%)';
    endTransition();
  }

  //////////////////////
  // moved by drag
  //////////////////////
  function onStartMouse(evt) {
    //console.log('onStartMouse');
    // get mouse x-position
    posstartX = evt.pageX || evt.touches[0].pageX;
    startX = posstartX * 100 / document.body.clientWidth / 3;
    currentX = startX;
    draggingPic = true;

    // set duration, so img is glued to cursor
    Inner.style.transitionDuration = '0s';
  }

  function onMoveMouse(evt) {
    //console.log('onMoveMouse');
    // set mouse x-position for update
    posX = evt.pageX  || evt.touches[0].pageX;
    currentX = posX * 100 / document.body.clientWidth / 3;
    window.requestAnimationFrame(update);
  }

  function update() {
    //console.log('update');
    // get distance from start to current position and translate IMG
    translateX = offsets[slide] + currentX - startX;
    //console.log('currentX: ' + currentX + ' // startX: ' + startX + ' // translateX: ' + translateX);
    Inner.style.transform = 'translate(' + translateX + '%, 0px)';
  }

  function onEndMouse() {
    //console.log('onEndMouse');
    // no dragging anymore & duration back to normal for smooth transform
    draggingPic = false;
    Inner.style.transitionDuration = '.4s';

    triggerTreshold = currentX - startX;
    translateX = offsets[slide] + triggerTreshold;

    // Is the user dragging far enough?
    if (Math.abs(triggerTreshold) > threshold) {
      if (triggerTreshold > 0) {
        prevDirection = -1;
      } else {
        prevDirection = 1;
      }
      changeSlide();
    } else {
      window.requestAnimationFrame(moveSlide);
    }
  }

  //////////////////////
  // Logic
  //////////////////////
  function down(evt) {
    // mousedown on buttons, check outer div.button-field and inner div
    if (
      evt.target.className == 'button-field' ||
      evt.target.className == 'material-icons button-next' ||
      evt.target.className == 'material-icons button-prev'
    ) {
      // 'click = false' blocks further clicking while executing
      if (click) {
        //console.log('click');
        click = false;
        // check if it's the prev button to set direction for changeSlide
        if (
          evt.target.id == 'btn-prev' ||
          evt.target.className == 'material-icons button-prev'
        ) {
          prevDirection = -1;
        } else {
          prevDirection = 1;
        }
        console.log('prevDirection: ' + prevDirection);
        changeSlide();
      }
      // if target is IMG, then it HAVE to be inner!!
    } else if (evt.target.nodeName == 'IMG' && click) {
      onStartMouse(evt);
    }
  }

  //////////////////////
  // Return
  //////////////////////
  return {
    hitinit: function() {
      init();
    },

    down: function(evt) {
      down(evt);
    },

    start: function(evt) {
      onStartMouse(evt);
    },

    move: function(evt) {
      onMoveMouse(evt);
    },

    end: function(evt) {
      onEndMouse(evt);
    },

    draggingPic: function() {
      return draggingPic;
    }
  };
})();

//////////////////////
// Event Listeners & their functions
//////////////////////

window.addEventListener('load', globalInit, {passive: true});

function addEventListeners() {
  document.addEventListener('mousedown', onDown, {passive: true});
  document.addEventListener('mousemove', onMove, {passive: true});
  document.addEventListener('mouseup', onEnd, {passive: true});

  document.addEventListener('touchstart', onTouchStart, {passive: true});
  document.addEventListener('touchmove', onTouchMove, {passive: true});
  document.addEventListener('touchend', onTouchEnd, {passive: true});
}

function globalInit() {
  turbotron.hitinit();
}

function onDown(evt) {
  console.log('down');
  turbotron.down(evt);
}

function onMove(evt) {
  if (turbotron.draggingPic()) {
    turbotron.move(evt);
  }
}

function onEnd(evt) {
  if (turbotron.draggingPic()) {
    turbotron.end(evt);
  }
}

// die touch-Events lösen vor den mouse-Events aus. Daher werden touch-Events hier abgefangen
// und stoppen den mouse-Event, damit der nicht doppelt kommt und geben das Event an die Logik
function onTouchStart(evt) {
  //evt.preventDefault();
  onDown(evt);
}

function onTouchMove(evt) {
  //evt.preventDefault();
  onMove(evt);
}

function onTouchEnd(evt) {
  //evt.preventDefault();
  onEnd(evt);
}
