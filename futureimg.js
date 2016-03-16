/**
 * Affichage d'une image dans un container (cover ou contain)
 */

( function($) {

	function applyFutureToImage( $image , settings , resizeMode ) {

		// récupération du container, width height
		var level = settings.parentLevel - 1;
		var container = $image.parents(":eq("+level+")");
		var containerWidth = container.outerWidth(true);
		var containerHeight = container.outerHeight(true);

		// chargement de l'image
		var actionInit = function( imageWidth, imageHeight ) {

			// Définition des position départ / arrivée
			var init_top = 0;
			var init_left = 0;
			var init_width = imageWidth;
			var init_height = imageHeight;
			var final_top = 0;
			var final_left = 0;
			var final_width = "100%";
			var final_height = "100%";

			// Définition du mode de transformation
			// Calcul des nouvelles dimensions
			var imageWidthTransform = containerHeight*imageWidth/imageHeight;
			if( settings.fillmode == "contain" ) {
				if( imageWidthTransform < containerWidth ) {
					final_width = imageWidthTransform;
					final_height = containerHeight;
					final_left = containerWidth/2 - final_width/2;
				} else {
					final_width = containerWidth;
					final_height = containerWidth*imageHeight/imageWidth;
					final_top = containerHeight/2 - final_height/2;
				}
			} else if( settings.fillmode == "cover" ) {
				if( imageWidthTransform < containerWidth ) {
					final_width = containerWidth;
					final_height = containerWidth*imageHeight/imageWidth;
					final_top = containerHeight/2 - final_height/2;
					final_left = containerWidth/2 - final_width/2;
				} else {
					final_width = imageWidthTransform;
					final_height = containerHeight;
					final_top = containerHeight/2 - final_height/2;
					final_left = containerWidth/2 - final_width/2;
				}
			}

			// Gestion des animation
			if( settings.animation == "zoomin" ) {
				init_width = final_width * (1-settings.zoomPercent/100);
				init_height = final_height * (1-settings.zoomPercent/100);
				init_top = containerHeight/2 - init_height/2;
				init_left = containerWidth/2 - init_width/2;
			} else if( settings.animation == "zoomout" ) {
				init_width = final_width * (1+settings.zoomPercent/100);
				init_height = final_height * (1+settings.zoomPercent/100);
				init_top = containerHeight/2 - init_height/2;
				init_left = containerWidth/2 - init_width/2;
			} else {
				init_top = final_top;
				init_left = final_left;
				init_width = final_width;
				init_height = final_height;
			}

			container.css("overflow","hidden");
			if( container.css("position") == "static"  ) container.css("position","relative");
			// position initiale
			if( !resizeMode ) {
				$image.css({
					visibility:"visible",
					opacity:0,
					position:"absolute",
					top:init_top,
					left:init_left,
					width:init_width,
					height:init_height,
					"max-width":"none",
					"max-height":"none",
				});
			}
			// position finale
			$image.css("display","block").animate({
				opacity: 1
			} , {duration:settings.opacitySpeed, queue:false} );
			$image.animate({
				top:final_top,
				left:final_left,
				width:final_width,
				height:final_height
			}, {duration:settings.animationSpeed, queue:false} );

			// hover
			if( settings.zoomOnHover ) {
				var hover_top = init_top;
				var hover_left = init_left;
				var hover_width = init_width;
				var hover_height = init_height;
				container.hover( function() {
					$image.animate({
						top:hover_top,
						left:hover_left,
						width:hover_width,
						height:hover_height
					}, {duration:settings.animationSpeed, queue:false} );
				} , function() {
					$image.animate({
						top:final_top,
						left:final_left,
						width:final_width,
						height:final_height
					}, {duration:settings.animationSpeed, queue:false} );
				} );
			}

		}
		// Chargemt image tampon
		var imgtmp = new Image(); 
		if( imgtmp.src > "" && imgtmp.complete ) {
			var imageWidth = imgtmp.width;
			var imageHeight = imgtmp.height;
			actionInit( imageWidth , imageHeight );
		} else {			
			var src = $image.attr("src");
			imgtmp.src = src;
			imgtmp.onload = function() {
				var imageWidth = imgtmp.width;
				var imageHeight = imgtmp.height;
				actionInit( imageWidth , imageHeight );
			}
		}

	}

	$.fn.futureimg = function( options ) {		

		// Default options
		// fillmode : cover or contain
		// animation : zoomin, zoomout, fade
		// animationSpeed : duration of animation
		// opacitySpeed : put 0 to fade, 1 to not fade
		// zoomPercent : percent of zoom for the animation zoomin and zoomout
		// parentLevel : level of the parent div container
		// zoomOnHover : enable the hover to zoom
		var resizeMode = resizeMode || false;
		var options = options || {};
		var optionsDefault = {
			fillmode : "cover",
			animation: "zoomout",
			animationSpeed: 500,
			opacitySpeed: 500,
			zoomPercent: 50,
			parentLevel: 1,
			zoomOnHover: false
		}
		var settings = $.extend( optionsDefault , options );
        
        // Load
        if( $(this).length > 1 ) {
            $(this).each( function() { $(this).futureimg( settings ) } );
            return;
        }
		if( $(this).is("img") && $(this).attr("src") > "" ) {
			applyFutureToImage( $(this) , settings );
		}

		// Resize
		var inst = $(this);
		$(window).resize( function() {
			applyFutureToImage( inst , settings , true );
		});

	};

	// By default, all classes futureimg are
	$(".futureimg").each( function() {
		var options = {};
		if( $(this).data("zoom-on-hover") ) options.zoomOnHover = $(this).data("zoom-on-hover");
		if( $(this).data("fillmode") ) options.zoomOnHover = $(this).data("fillmode");
		if( $(this).data("animation") ) options.zoomOnHover = $(this).data("animation");
		$(this).futureimg( options );
	});

}(jQuery) );