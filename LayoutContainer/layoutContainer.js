(function($) {
	
	/*
	 *	layout - Lays out and resizes the contents of the specified container in the optimal arrangement
	 *	and size so that they fill the space. This is intended for use with the OpenTok library to layout 
	 *	Subscribers and Publishers.
	 *
	 *	animate - Boolean value whether to animate the transition to the new layout.
	 */
	$.fn.layout = function(animate) {
		this.each(function() {
			var subscriberBox = this;
			// get the size of the container
			Width = $(subscriberBox).width();
			Height = $(subscriberBox).height();
			$(subscriberBox).css("position", "relative");

			// Aspect ratio of the streams
			var vid_ratio = 3/4;

			// Finds the ideal number of columns and rows to minimize the amount of wasted space
			var count = subscriberBox.children.length;
			var min_diff;
			var targetCols;
			var targetRows;
			var availableRatio = Height / Width;
			for (var i=1; i <= count; i++) {
				var cols = i;
				var rows = Math.ceil(count / cols);
				var ratio = rows/cols * vid_ratio;
				var ratio_diff = Math.abs( availableRatio - ratio);
				if (!min_diff || (ratio_diff < min_diff)) {
					min_diff = ratio_diff;
					targetCols = cols;
					targetRows = rows;
				}
			};


			var videos_ratio = (targetRows/targetCols) * vid_ratio;

			if (videos_ratio > availableRatio) {
				targetHeight = Math.floor( Height/targetRows );
				targetWidth = Math.floor( targetHeight/vid_ratio );
			} else {
				targetWidth = Math.floor( Width/targetCols );
				targetHeight = Math.floor( targetWidth*vid_ratio );
			}

			var spacesInLastRow = (targetRows * targetCols) - count;
			var lastRowMargin = (spacesInLastRow * targetWidth / 2);
			var lastRowIndex = (targetRows - 1) * targetCols;

			var firstRowMarginTop = ((Height - (targetRows * targetHeight)) / 2);
			var firstColMarginLeft = ((Width - (targetCols * targetWidth)) / 2);

			// Loop through each stream in the container and place it inside
			var x = 0;
			var y = 0;
			for (i=0; i < subscriberBox.children.length; i++) {
				if (i % targetCols == 0) {
					// We are the first element of the row
					x = firstColMarginLeft;
					if (i == lastRowIndex) x += lastRowMargin;
					y += i == 0 ? firstRowMarginTop : targetHeight;
				} else {
					x += targetWidth;
				}

				var parent = subscriberBox.children[i];
				var child = subscriberBox.children[i].firstChild;

				$(parent).css("position", "absolute");

				var targetPosition = {
					left: x + "px",
					top: y + "px",
					width: targetWidth + "px",
					height: targetHeight + "px"
				};

				// Set position and size of the stream container
				if (animate) {
					$(parent).moveSWF(x, y, 200);
					$(parent).resizeSWF(targetWidth, targetHeight, 200);
				} else {
					$(parent).css(targetPosition);
				}

				// Set the height and width of the flash object (stream) that sits in the contaienr
				child.width = targetWidth;
				child.height = targetHeight;
			};
		});
		
		return this;
	};
	
	var divCount = 0;
	
	/*
	 *	createElement - creates a new element inside the layout container and returns its div id to
	 * 		be passed to the publish or subscribe method in the OpenTok API.
	 */
	$.fn.createElement = function() {
		var divId;
		this.each(function() {
			divId = "stream" + divCount++;
			var container = document.createElement("div");

			var div = document.createElement("div");
			div.setAttribute('id', divId);
			container.appendChild(div);

			this.appendChild(container);
		});
		return divId;
	};
})(jQuery);