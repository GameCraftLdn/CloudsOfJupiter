// set up canvas
var     canvas = document.getElementById( "paperCanvas" ),
   canvasWidth = canvas.offsetWidth,
  canvasHeight = canvas.offsetHeight,
  canvasCenter = new Point( canvasWidth / 2, canvasHeight / 2 );

// random number wrapper
function randNum ( min, max ) {
  return Math.floor( Math.random() * max + min );
}

// random point wrapper
function randPoint () {
  return new Point( randNum( 0, canvasWidth ), randNum( 0, canvasHeight ) );
}

// set up fuel items
var fuelItems = 20;
var fuelGroup = new Group();

for ( var f = 0; f < fuelItems; f++ ) {
  fuelGroup.addChild(
    new Path.RegularPolygon({
      center: randPoint(),
      sides: 3,
      radius: 6,
      strokeColor: '#4F4',
      strokeWidth: 2,
    }).rotate( 180 )
  );
}

// get ship raster & position
var ship = new Raster( 'ship' );
ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

// animation stuff.
function onFrame( event ) {

  // move fuel down screen remove if off screen
  for( var f = 0; f < fuelGroup.children.length; f++  ) {
    var thisFuel = fuelGroup.children[ f ];

    thisFuel.position += [ 0, 2 ];

    if( thisFuel.bounds.top > canvasHeight ) {
      thisFuel.position = [ randNum( 0, canvasWidth ), 0 ];
    }
  }

  // move ship with gamepad
  if( navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 20, 0 ];
  } else if( navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 20, 0 ];
  }
}