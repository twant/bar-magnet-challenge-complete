// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Example' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Steele Dalton (PhET Interactive Simulations)
 * @author Taylor Want (applicant: Junior Developer, October 2018)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMagnet = require( 'EXAMPLE_SIM/example/model/BarMagnet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var exampleSim = require( 'EXAMPLE_SIM/exampleSim' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * Main constructor for ExampleModel, which contains the bar magnet.
   * @constructor
   */
  function ExampleModel() {

    // @public {BarMagnet} - initial bar magnet model element
    this.barMagnet = new BarMagnet( new Dimension2( 262.5, 52.5 ), new Vector2( 0, 0 ), 0 );

    // @public {ObservableArray} - array to hold added bar magnets model elements
    this.barMagnets = new ObservableArray();
  }

  exampleSim.register( 'ExampleModel', ExampleModel );

  return inherit( Object, ExampleModel, {

    /**
    * Moves a given magnet to a random position on the screen. This method is called
     when the "move bar magnet" and "add bar magnet" buttons are pressed.
    * @public
    */
    moveBarMagnet: function( magnet ){
      // generates random x and y locations.
      var locationX = ( phet.joist.random.nextDouble() * window.innerWidth / 2 - magnet.size.width / 2 ) * ( phet.joist.random.nextBoolean() ? -1 : 1 );
      var locationY = ( phet.joist.random.nextDouble() * window.innerHeight / 2 - magnet.size.height ) * ( phet.joist.random.nextBoolean() ? -1 : 1 );

      // sets the magnet's location to the new random values
      magnet.locationProperty.set( {x: locationX, y: locationY} );
    },

    /**
    * creates a new bar magnet, moves it to random location, and adds it to the barMagnets array. This method is called when the "add bar magnet" button is pushed
    * @public
    */
    addBarMagnet: function() {
      // create a new bar magnet element and moves to a random location
      var newBarMagnet = new BarMagnet( new Dimension2( 262.5, 52.5 ), new Vector2( 0, 0 ), 0 );
      this.moveBarMagnet( newBarMagnet );

      // add the bar magnet ot the barMagnets array
      this.barMagnets.push( newBarMagnet );
    },

    /**
    * Restores the initial state of all model elements. This method is called when the simulation "Reset All" button is
    * pressed.
    * @public
    */
    reset: function() {
      this.barMagnet.reset();
      this.barMagnets.reset();
    }
  } );
} );
