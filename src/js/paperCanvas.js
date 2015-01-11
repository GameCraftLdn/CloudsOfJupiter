// set up canvas
var canvas = document.getElementById("paperCanvas"),
  canvasWidth = canvas.offsetWidth,
  canvasHeight = canvas.offsetHeight,
  canvasCenter = new Point(canvasWidth / 2, canvasHeight / 2),
  counter = 0,
  frameTicker = 1,
  maxShipSize = 15,
  stopped = true;

// fuel counter
var counterElm = document.getElementById( "counter" );
var fuelCounter = 0;

// random number wrapper
function randNum ( min, max ) {
  return Math.floor( Math.random() * max + min );
}

// random point wrapper
function randPoint () {
  return new Point( randNum( 0, canvasWidth ), randNum( 0, canvasHeight ) );
}

// set up fuel items
var fuelItems = 50;
var fuelGroup = new Group();

// create fuel item to be cloned.
var fuel = new Path.RegularPolygon({
  center: [ -30, -30],
  sides: 6,
  radius: 30,
  opacity: 0.35,
  fillColor: '#4F4',
});

// clone fuel item and randomise position, opacity, & scale
function cloneFuel () {
  var fuelClone = fuel.clone();
      fuelClone.position = randPoint();
      fuelClone.opacity = Math.random() * 0.5 + 0.25;
      fuelClone.scale( Math.random() * 1 + 0.25 );
  return fuelClone;
}

// add fuel items to group
for ( var f = 0; f < fuelItems; f++ ) {
  fuelGroup.addChild(cloneFuel());
}

// set up fuel items
var baddiesItems = 10;
var baddiesGroup = new Group();

// create fuel item to be cloned.
var baddie = new Path.RegularPolygon({
  center: [ -30, -30],
  sides: 3,
  radius: 20,
  opacity: 0.85,
  fillColor: '#B00',
}).rotate(180);

function cloneBaddie () {
  var baddieClone = baddie.clone();
      baddieClone.position = randPoint();
      baddieClone.scale( Math.random() * 1 + 0.35 );
  return baddieClone;
}

for ( var f = 0; f < baddiesItems; f++ ) {
  baddiesGroup.addChild(cloneBaddie());
}

// get ship raster & position
var shipSize = 1;
var ship = new Raster( 'ship-0'+ shipSize );
ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

function setShipSize(size) {
  ship.source = 'ship-0' + size;
}

function loseLive() {
  $('#lifes div:first-child').remove();
  if ($('#lifes div').length <= 0) {
    view.pause();
    $( '.game-over' ).addClass( 'open' );
  }
}

function collision(group, point, tolerance, clone) {
  hit = group.hitTest(point, {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: tolerance
  });
  if (hit) {
    hit.item.remove();
    group.addChild(clone());
    if (clone === cloneFuel) {
      ++counter;
    }
    if (clone === cloneBaddie) {
      loseLive();
    }
    if ( counter % 10 === 0 ) {
      level = Math.min(counter / 10 + 1, maxShipSize);
      setShipSize(level);
      document.getElementById('level').innerHTML = level;
    }
    counterElm.innerHTML = counter;
  }
}

function move(item) {
  // move down screen
  item.position += [0, 2];
  // if it get to bottom move to top
  if (item.bounds.top > canvasHeight) {
    item.position = [randNum(0, canvasWidth), 0];
  }
}

// animation stuff.
function onFrame( event ) {
  if (stopped) {
    view.pause();
    return;
  }
  document.getElementById('timer').innerHTML = Math.round(event.time/60) + ":" + (event.time % 60).toFixed(2);

  // get progressively harder
  if (frameTicker % 100 === 0) {
    fuelGroup.firstChild.remove();
    baddiesGroup.addChild(cloneBaddie());
    console.log("Fuel in game: %d, baddies in game: %d", fuelGroup.children.length, baddiesGroup.children.length);
  }

  // collision for fuel
  collision(fuelGroup, ship.bounds.center, Math.min(ship.bounds.width, ship.bounds.height)/2, cloneFuel);
  collision(fuelGroup, ship.bounds.topLeft, 0, cloneFuel);
  collision(fuelGroup, ship.bounds.topRight, 0, cloneFuel);

  // collision for baddies
  collision(baddiesGroup, ship.bounds.center, Math.min(ship.bounds.width, ship.bounds.height)/2, cloneBaddie);
  collision(baddiesGroup, ship.bounds.topLeft, 0, cloneBaddie);
  collision(baddiesGroup, ship.bounds.topRight, 0, cloneBaddie);

  // move fuel and baddies down the canvas
  fuelGroup.children.forEach(move);
  baddiesGroup.children.forEach(move);

  // move ship with gamepad
  if( navigator.getGamepads()[0] && navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 10, 0 ];
  } else if( navigator.getGamepads()[0] && navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 10, 0 ];
  }
  frameTicker++;
}

function onKeyDown(event) {
  if (stopped)
    return;
  if (event.key == 'left') 
    ship.position -= [ 10, 0 ];
  if (event.key == 'right') 
    ship.position += [ 10, 0 ];
}

$( '#start' ).click( function () {
  $( '.splash' ).toggleClass( 'open' );
  stopped = false;
  view.play();
});

$( '#info-btn' ).click( function () {
  $( '.splash' ).toggleClass( 'open' );
  stopped = true;
  view.pause();
});
