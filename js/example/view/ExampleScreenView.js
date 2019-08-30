// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Example' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Steele Dalton (PhET Interactive Simulations)
 * @author Taylor Want (applicant: Junior Developer, October 2018)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMagnetNode = require( 'EXAMPLE_SIM/example/view/BarMagnetNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'EXAMPLE_SIM/example/view/ControlPanel' );
  var exampleSim = require( 'EXAMPLE_SIM/exampleSim' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for the ExampleScreenView, it creates the bar magnet node and control panel node.
   *
   * @param {ExampleModel} model - the model for the entire screen
   * @constructor
   */
  function ExampleScreenView( model ) {
    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // model-view transform
    var center = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height / 2 );
    var modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( center, 1 );

    //create node for the play area a11y features.
    var playAreaNode = new Node( {
      tagName: 'div',
      labelTagName: 'h2',
      labelContent: 'Play Area',
      descriptionTagName: 'p',
      descriptionContent: 'This is the play area.'
    } );

    //add bar magnets to the play area
    playAreaNode.addChild( new BarMagnetNode( model.barMagnet, modelViewTransform, this.layoutBounds, {
      labelContent: `Bar Magnet ${model.barMagnets.length + 1}`
    } ) );

    //add play area to the screen
    this.addChild( playAreaNode );
    this.addChild( new ControlPanel( model, {
      x: 50,
      y: 50
    } ) );

    // add or remove a node when the model's barMagnets array is modified
    model.barMagnets.addItemAddedListener( addedMagnet => {
      // add a node for the new magnet
      playAreaNode.addChild( new BarMagnetNode( addedMagnet, modelViewTransform, this.layoutBounds, {
        labelContent: `Bar Magnet ${model.barMagnets.length + 1}`
      } ) );

      // add a listener to remove the node when that magnet is removed from the model
      model.barMagnets.addItemRemovedListener( function removalListener( removedMagnet ) {
        if ( removedMagnet === addedMagnet ) {
          playAreaNode.removeChild( removedMagnet );
          removedMagnet.dispose();
          model.barMagnets.removeItemRemovedListener( removalListener );
        }
      } );
    } );
  }

  exampleSim.register( 'ExampleScreenView', ExampleScreenView );

  return inherit( ScreenView, ExampleScreenView );
} );
