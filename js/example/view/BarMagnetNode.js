// Copyright 2018, University of Colorado Boulder

/**
 * View for the bar magnet object, which can be dragged to translate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Steele Dalton (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var exampleSim = require( 'EXAMPLE_SIM/exampleSim' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // images
  var barMagnetImage = require( 'image!EXAMPLE_SIM/barMagnet.png' );

  /**
   * Constructor for the BarMagnetNode which renders the bar magnet as a scenery node.
   *
   * @param {BarMagnet} barMagnet - the model of the bar magnet
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BarMagnetNode( barMagnet, modelViewTransform, screenViewBounds, options ) {

    var self = this;
    options = _.extend( {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer',
      tagName: 'div',
      labelTagName: 'h3',
      descriptionTagName: 'p',
      descriptionContent: 'This is a bar magnet',
      ariaRole: 'application',
      focusable: true
    }, options );
    // Call the super constructor
    Node.call( this, options );

    // Add the centered bar magnet image
    this.addChild( new Image( barMagnetImage, {
      centerX: 0,
      centerY: 0
    } ) );

    // Scale it so it matches the model width and height
    var scaleX = modelViewTransform.modelToViewDeltaX( barMagnet.size.width ) / this.width;
    var scaleY = modelViewTransform.modelToViewDeltaY( barMagnet.size.height ) / this.height;
    this.scale( scaleX, scaleY );

    // When dragging, move the bar magnet
    this.addInputListener( new SimpleDragHandler( {

      // When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      // Translate on drag events
      translate: function( args ) {
        barMagnet.locationProperty.set( modelViewTransform.viewToModelPosition( args.position ) );
      }
    } ) );

    // When dragging, move the bar magnet
    this.addInputListener( new KeyboardDragListener( {

      locationProperty: barMagnet.locationProperty,
      transform: modelViewTransform,
      downDelta: 5,
      shiftDownDelta: 2.5,

      //alert the user if the magnet gets dragged offscreen
      drag: function() {
        let alertText;
        if ( barMagnet.locationProperty.get().x > screenViewBounds.maxX / 2 ) {
          alertText = 'magnet offscreen. move left';
        }
        if ( barMagnet.locationProperty.get().x < screenViewBounds.maxX / 2 * -1 ) {
          alertText = 'magnet offscreen. move right';
        }
        if ( barMagnet.locationProperty.get().y < screenViewBounds.maxY / 2 * -1 ) {
          alertText = 'magnet offscreen. move down.';
        }
        if ( barMagnet.locationProperty.get().y > screenViewBounds.maxY / 2 ) {
          alertText = 'magnet dragged offscreen. move up';
        }

        alertText && utteranceQueue.addToBack( new Utterance( {
          alert: alertText,
          uniqueGroupId: 'boundaryAlert'
        } ) );
      },

      end: function( event ) {
        const endLocationX = barMagnet.locationProperty.get().x + screenViewBounds.maxX / 2;
        const endLocationY = barMagnet.locationProperty.get().y + screenViewBounds.maxY / 2;
        console.log( `screenViewBounds: ${screenViewBounds.maxX}, ${screenViewBounds.maxY}` );
        console.log( `endLocation: ${endLocationX}, ${endLocationY}` );
        let vertArea;
        let horizArea;
        if ( 2 * screenViewBounds.maxY / 3 < endLocationY && endLocationY < screenViewBounds.maxY ) {
          vertArea = 'bottom';
        }
        else if ( 0 < endLocationY && endLocationY < screenViewBounds.maxY / 3 ) {
          vertArea = 'top';
        }
        else {
          vertArea = 'center';
        }

        if ( 2 * screenViewBounds.maxX / 3 < endLocationX && endLocationX < screenViewBounds.maxX ) {
          horizArea = 'right';
        }
        else if ( 0 < endLocationX && endLocationX < screenViewBounds.maxX / 3 ) {
          horizArea = 'left';
        }
        else {
          horizArea = 'center';
        }

        if ( endLocationX ) {
          utteranceQueue.addToBack( new Utterance( {
            alert: `The magnet is in the ${( vertArea === 'center' && horizArea === 'center' ) ?
                                           '' :
                                           vertArea} ${horizArea} of the play area`,
            uniqueGroupId: 'newPositionAlert'
          } ) );
        }
      }

    } ) );

    // Observe changes in model location and update the view. This element always exists and does not need to be
    // unlinked.
    barMagnet.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // Observe changes in model orientation and update the view. This element always exists and does not need to be
    // unlinked.
    barMagnet.orientationProperty.link( function( orientation ) {
      self.rotation = orientation;
    } );
  }


  exampleSim.register( 'BarMagnetNode', BarMagnetNode );

  return inherit( Node, BarMagnetNode );

} );
