// set up canvas
var     canvas = document.getElementById( "paperCanvas" ),
   canvasWidth = canvas.offsetWidth,
  canvasHeight = canvas.offsetHeight,
  canvasCenter = new Point( canvasWidth / 2, canvasHeight / 2 );

var ship = new Raster( 'ship' );

ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

var gamepad = navigator.getGamepads()[0];

function onFrame( event ) {
  if( navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 20, 0 ];
  }

  if( navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 20, 0 ];
  }
}