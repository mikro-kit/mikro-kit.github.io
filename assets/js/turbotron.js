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
  var Inner = document.getElementById('turbotron-inner');
  var indicators = document.getElementsByClassName('turbotron-indicators__fill');
  var turbotronLength = document.querySelectorAll('.turbotron-slide').length;
  var offsets = [0];

  // Timing
  var animateSec = '.7s';
  var noAnimate = '0s';

  // Variables
  var slide = 1;
  var indicatorSlide = 0;
  var click = true;
  var prevDirection = 1;
  var translateX = 0;
  var moveDirection = 0;

  // Variables for touch
  var draggingPic = false;
  var currentX = 0;
  var posX = 0;
  var posstartX = 0;
  var startX = 0;
  var threshold = 4.5;

  //////////////////////
  // Functions
  //////////////////////

  // Begin with init and resize
  function init() {
    // Erzeugt ein Array mit den Werten für transform: translateX()
    // - index - 1 ergibt [-1, 0, 1, 2, etc.]
    // - * -1 damit die Werte zum Verschieben negativ sind
    // - (Math.round etc.) teilt die Breite (100%) durch die Anzahl der Objekte
    // 10000 & / 100 sorgen für Werte mit 2 Dezimalstellen
    offsets = Array.apply(null, {length: turbotronLength}).map(function(value, index) {
      return (index - 1) * -1 * (Math.round(10000 / turbotronLength) / 100);
    });
    addEventListeners();
  }

  //////////////////////
  // moved by click - functions
  //////////////////////
  function changeSlide() {
    //console.log('changeSlide');
    //
    if (slide == 0 || slide == turbotronLength) {
      indicatorSlide = 2;
    } else {
      indicatorSlide = slide - 1;
    }

    indicators[indicatorSlide].classList.remove('turbotron-indicators__active');

    slide = (slide + turbotronLength + 1 * prevDirection) % turbotronLength;

    if (slide == 0 || slide == turbotronLength) {
      indicatorSlide = 2;
    } else {
      indicatorSlide = slide - 1;
    }
    indicators[indicatorSlide].classList.add('turbotron-indicators__active');

    //console.log('changeSlide slide: ' + slide);
    window.requestAnimationFrame(moveSlide);
  }

  function moveSlide() {
    //console.log('moveSlide');
    Inner.style.transitionDuration = animateSec;
    Inner.style.transform = 'translateX(' + offsets[slide] + '%)';
    // captionBox.style.transform = 'translate(' + translateCaption[slide] + '%, 0%)';
    // indicators[oldSlide].style.opacity = '0';
    // indicators[slide].style.opacity = '1';
    Inner.addEventListener('transitionend', endTransition, false);
  }

  function checkSlide() {
    if (slide == 0 && prevDirection < 0) {
      //console.log('if slide: ' + slide);
      switchSlide(false);
    } else if (slide == turbotronLength - 1 && prevDirection > 0) {
      //console.log('else if slide: ' + slide);
      switchSlide(true);
    } else {
      //console.log('else');
      changeSlide();
    }
  }

  function endTransition() {
    //console.log('endTransition');
    click = true;
    Inner.removeEventListener('transitionend', endTransition, false);
  }

  function switchSlide(forward) {
    //console.log('switchSlide');
    if (forward) {
      slide = 0;
    } else {
      slide = turbotronLength - 1 ;
    }
    //console.log('switchSlide slide: ' + slide);
    Inner.style.transitionDuration = noAnimate;
    Inner.style.transform = 'translateX(' + offsets[slide] + '%)';
    changeSlide();
  }

  //////////////////////
  // moved by drag
  //////////////////////
  function onStartMouse(evt) {
    //console.log('onStartMouse');
    // get mouse x-position
    posstartX = evt.pageX || evt.touches[0].pageX;
    startX = posstartX * 100 / document.body.clientWidth / turbotronLength;
    currentX = startX;
    draggingPic = true;

    // set duration, so img is glued to cursor
    Inner.style.transitionDuration = noAnimate;
  }

  function onMoveMouse(evt) {
    if (draggingPic) {
      //console.log('onMoveMouse');
      // set mouse x-position for update
      posX = evt.pageX  || evt.touches[0].pageX;
      currentX = posX * 100 / document.body.clientWidth / turbotronLength;
      moveDirection = currentX - startX;
      if (slide == 0 && moveDirection > 0) {
        //console.log('rand links!');
        slide = turbotronLength - 1;
      } else if (slide == turbotronLength - 1 && moveDirection < 0) {
        //console.log('rand rechts!');
        slide = 0;
      }
      translateX = offsets[slide] + moveDirection;
      window.requestAnimationFrame(update);
    }
  }

  function update() {
    //console.log('update');
    // get distance from start to current position and translate IMG
    Inner.style.transform = 'translateX(' + translateX + '%)';
  }

  function onEndMouse() {
    //console.log('onEndMouse');
    // no dragging anymore & duration back to normal for smooth transform
    draggingPic = false;
    Inner.style.transitionDuration = animateSec;

    // Is the user dragging far enough?
    if (Math.abs(moveDirection) > threshold) {
      if (moveDirection > 0) {
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
        //console.log('prevDirection: ' + prevDirection);
        checkSlide();
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
  //console.log('down');
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
