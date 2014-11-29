// set up canvas
var     canvas = document.getElementById( "paperCanvas" ),
   canvasWidth = canvas.offsetWidth,
  canvasHeight = canvas.offsetHeight,
  canvasCenter = new Point( canvasWidth / 2, canvasHeight / 2 ),
  counter      = 0;

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

// set hittest options
var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

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
  var fuelClone = cloneFuel();

  fuelGroup.addChild(
    fuelClone
  );
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

function clonebaddie () {
  var baddieClone = baddie.clone();
      baddieClone.position = randPoint();
      baddieClone.scale( Math.random() * 1 + 0.35 );
  return baddieClone;
}

for ( var f = 0; f < baddiesItems; f++ ) {
  var baddieClone = clonebaddie();

  baddiesGroup.addChild(
    baddieClone
  );
}

// get ship raster & position
var shipSize = 1;
var ship = new Raster( 'ship-0'+ shipSize );
ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

function growShip() {
  shipSize += 1;

  if ( shipSize === 15 ) {
    shipSize = 14;
  }

  ship.source = 'ship-0' + shipSize;
}

function collision(group, point, tolerance) {
  hit = fuelGroup.hitTest(point, {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: tolerance
  });
  if (hit) {
    hit.item.remove();
    group.addChild(cloneFuel());
    ++counter;
    document.getElementById('counter').innerHTML = counter;
    if ( counter % 10 === 0 ) growShip();
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
  document.getElementById('timer').innerHTML = Math.round(event.time/60) + ":" + (event.time % 60).toFixed(2);

  // collision for fuel
  collision(fuelGroup, ship.bounds.center, Math.min(ship.bounds.width, ship.bounds.height)/2);
  collision(fuelGroup, ship.bounds.topLeft, 0);
  collision(fuelGroup, ship.bounds.topRight, 0);

  // move fuel and baddies down the canvas
  fuelGroup.children.forEach(move);
  baddiesGroup.children.forEach(move);

  // move ship with gamepad
  if( navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 10, 0 ];
  } else if( navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 10, 0 ];
  }
}
