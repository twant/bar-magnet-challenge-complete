// Copyright 2013-2017, University of Colorado Boulder

/**
 * Panel of controls at the top left of the sim. It contains controls for flipping the magnet and the reset all button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Steele Dalton (PhET Interactive Simulations)
 * @author Taylor Want (applicant: Junior Developer, October 2018)
 */
define( function( require ) {
  'use strict';

  // modules
  var exampleSim = require( 'EXAMPLE_SIM/exampleSim' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BarMagnet = require( 'EXAMPLE_SIM/example/model/BarMagnet' );

  //view dependencies--needed to create new bar magnet nodes
  var BarMagnetNode = require( 'EXAMPLE_SIM/example/view/BarMagnetNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  // strings
  var flipPolarityString = require( 'string!EXAMPLE_SIM/flipPolarity' );
  var moveBarMagnetString = require( 'string!EXAMPLE_SIM/moveBarMagnet');
  var newBarMagnetString = require( 'string!EXAMPLE_SIM/newBarMagnet')




  /**
   * @param {ExampleModel} model - the model for the entire screen
   * @param {ExampleScreenView} view - the view that instantiates the control panel
   * @param {Object} [options] - scenery options for rendering the control panel, see the constructor for options
   * @constructor
   */
  function ControlPanel( view, model, options) {
    // Demonstrate a common pattern for specifying options and providing default values
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'orange',
        lineWidth: 3
      }, options );

    //generates either 1 or -1 randomly, one for x and one for y--used later to ensure magnet can be in either half of screen
    var posX = (Math.random() > 0.5) ? -1 : 1
    var posY = (Math.random() > 0.5) ? -1 : 1

    //gets the height and width of a bar magnet
    var width = model.barMagnet.size.width
    var height = model.barMagnet.size.height

    // 'Flip Polarity' button
    var flipButton = new TextPushButton( flipPolarityString, {
      font: new PhetFont( 16 ),
      baseColor: 'yellow',
      xMargin: 10,
      listener: function() {
        var orientation = model.barMagnet.orientationProperty.get() + Math.PI;
        model.barMagnet.orientationProperty.set( orientation );
      }
    } );

    // 'Move Bar Magnet' button
    var moveButton = new TextPushButton( moveBarMagnetString, {
      font: new PhetFont( 16 ),
      baseColor: 'yellow',
      xMargin: 10,
      listener: function() {
        //ensures the new location can have either positive or negative values (since the center of the screen is (0,0))
        posX = (Math.random() > 0.5) ? -1 : 1
        posY = (Math.random() > 0.5) ? -1 : 1

        //sets the new location to a random location somewhere in the window. Subtracts the magnet width or height (for x or y) to ensure the magnet stays within the screen.
        var location = {x: (Math.random() * window.innerWidth/2 - width/2)*posX, y: (Math.random() * window.innerHeight/2 - height)*posY}
        model.barMagnet.locationProperty.set(location);

      }
    } );

    var newButton = new TextPushButton( newBarMagnetString, {
      font: new PhetFont( 16 ),
      baseColor: 'yellow',
      xMargin: 10,
      listener: function() {
        //ensures the new location can have either positive or negative values (since the center of the screen is (0,0))
        posX = (Math.random() > 0.5) ? -1 : 1
        posY = (Math.random() > 0.5) ? -1 : 1

        //model-view transform
        var center = new Vector2( view.layoutBounds.width / 2, view.layoutBounds.height / 2 );
        var modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( view.center, 1 );
        //create new magnet model (BarMagnet)
        var xLoc = Math.random()*window.innerWidth/2*posX - width*posX
        var yLoc = Math.random() * view.layoutBounds.height/2*posY - height/2*posY
        var newMagnet=new BarMagnet( new Dimension2( width, height ), new Vector2(xLoc, yLoc), 0 )
        
        //create new magnet view (BarMagnetNode)
        var newMagnetNode = new BarMagnetNode( newMagnet, modelViewTransform )
        //add to children array of the ExampleScreenView object
        view.addChild(newMagnetNode)
      }
    } );

    // 'Reset All' button, resets the sim to its initial state
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        view.children=view.children.slice(0,2)
      }
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        flipButton,
        moveButton,
        newButton,
        resetAllButton
      ]
    } );

    Panel.call( this, content, options );
  }

  exampleSim.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );
