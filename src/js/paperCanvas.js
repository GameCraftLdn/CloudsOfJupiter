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

// set hittest options
var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

// set up fuel items
var fuelItems = 20;
var fuelGroup = new Group();

var fuel = new Path.RegularPolygon({
  center: [ -10, -10],
  sides: 3,
  radius: 6,
  strokeColor: '#4F4',
  strokeWidth: 2,
}).rotate( 180 );

for ( var f = 0; f < fuelItems; f++ ) {
  var fuelClone = fuel.clone();
      fuelClone.position = randPoint();
  fuelGroup.addChild(
    fuelClone
  );
}

// get ship raster & position
var ship = new Raster( 'ship' );
ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

// animation stuff.
function onFrame( event ) {

  // handle all fuel items
  for( var f = 0; f < fuelGroup.children.length; f++  ) {
    var thisFuel = fuelGroup.children[ f ];

    thisFuel.position += [ 0, 2 ];

    if( thisFuel.bounds.top > canvasHeight ) {
      thisFuel.position = [ randNum( 0, canvasWidth ), 0 ];
    }

    if ( ship.hitTest( thisFuel.position, hitOptions ) ){
      thisFuel.remove();
      console.log( "hit" );

      var fuelClone = fuel.clone();
          fuelClone.position = [ randNum( 0, canvasWidth ), -10 ];
      fuelGroup.addChild(
        fuelClone
      );
    }
  }

  // move ship with gamepad
  if( navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 20, 0 ];
  } else if( navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 20, 0 ];
  }
}