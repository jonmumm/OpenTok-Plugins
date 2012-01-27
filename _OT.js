var _OT = {};
  
_OT.widget = function() {
	var session;
	var publisher;
	var properties;
	
	var ele = {}; // Holds view elements
	var sizes = {};

	//--------------------------------------
	//  OPENTOK EVENT HANDLERS
	//--------------------------------------
	var sessionConnectedHandler = function (event) {
		// Subscribe to all streams currently in the Session
		subscribeToStreams(event.streams);
		
	  // Publish my stream to the session
	  if (properties.autoPublish) {
	    publishStream();
	  }

		_OT.layoutContainer.layout();
	};

	var streamCreatedHandler = function (event) {
		// Subscribe to the newly created streams
		subscribeToStreams(event.streams);
		_OT.layoutContainer.layout();
	};

	var streamDestroyedHandler = function (event) {	
		// Get all destroyed streams		
		for (var i = 0; i < event.streams.length; i++) {
			// For each stream get the subscriber to that stream
			var subscribers = session.getSubscribersForStream(event.streams[i]);
			for (var j = 0; j < subscribers.length; j++) {
				// Then remove each stream
				_OT.layoutContainer.removeStream(subscribers[j].id);
			}
		}

		// Re-layout the container without the removed streams
		_OT.layoutContainer.layout();
	};

	/*
	If you un-comment the call to TB.addEventListener("exception", exceptionHandler) above, OpenTok calls the
	exceptionHandler() method when exception events occur. You can modify this method to further process exception events.
	If you un-comment the call to TB.setLogLevel(), above, OpenTok automatically displays exception event messages.
	*/
	var exceptionHandler = function (event) {
		alert("Exception: " + event.code + "::" + event.message);
	};

	//--------------------------------------
	//  HELPER METHODS
	//--------------------------------------
	var publishStream = function (_properties) {
    // Only publish if we have the capability to
    if (session.capabilities.publish != 1) return;
	  
	  // If we are already publishing, don't do anything
	  if (publisher != null) return;
	  
	  _properties = _properties || {};
	  
	  properties.publisherSize = _properties.publisherSize || properties.publisherSize;
	  properties.name = _properties.name || properties.name;
    properties.publishFull = _properties.publishFull || properties.publishFull; 

    publisherProps = {};
    publisherProps.name = properties.name;

    if (!properties.publishFull) {
      sizes.publisher = {};
      switch (properties.publisherSize) {
        case 'small':
          sizes.publisher.width = 50;
          sizes.publisher.height = 50;
          break;
        case 'medium':
          sizes.publisher.width = 125;
          sizes.publisher.height = 125;
          break;	 
        case 'large':
          sizes.publisher.width = 200;
          sizes.publisher.height = 200;
          break;
        default:
          sizes.publisher.width = 125;
          sizes.publisher.height = 125;
      }		

      publisherProps.width = sizes.publisher.width;
      publisherProps.height = sizes.publisher.height;
      
      var accessBoxHeight = (sizes.publisher.height > 142) ? sizes.publisher.height : 142;
      
      ele.publisherContainer.style.left = ((sizes.container.width / 2) - (215 / 2)) + 'px';
      ele.publisherContainer.style.top = ((sizes.container.height / 2) - (accessBoxHeight / 2)) + 'px';
      ele.publisherContainer.style.visibility = 'visible';

      var div = document.createElement('div');
      div.setAttribute('id', 'publisher');
      ele.publisherContainer.appendChild(div);
    } else {
      _OT.layoutContainer.addStream('publisher', true);
    }
    publisherProps.wmode = "window";
	  
	  publisher = session.publish('publisher', publisherProps);
	};
	
	var unpublishStream = function() {
	  if (publisher) {
	    session.unpublish(publisher);
	  }
	  publisher = null;
	  
	  ele.publisherContainer.style.visibility = 'hidden';
	};
	
	var placePublisher = function() {
	  ele.publisherContainer.style.width = sizes.publisher.width + 'px';
	  ele.publisherContainer.style.height = sizes.publisher.height + 'px';
	  ele.publisherContainer.style.left = '0px';
	  ele.publisherContainer.style.top = '0px';
	  ele.publisherContainer.style.border = '1px solid white';
	  ele.publisherContainer.style.margin = '4px';
	};
	
	var subscribeToStreams = function (streams) {
		// For each stream
		for (var i = 0; i < streams.length; i++) {
			// Check if this is the stream that I am publishing, and if so do not subscribe.
			if (streams[i].connection.connectionId != session.connection.connectionId) {
				// Make a unique div id for this stream
				var divId = 'stream_' + streams[i].streamId;

				// Pass in FALSE since this is a subscriber
				var containerDiv = _OT.layoutContainer.addStream(divId, false);

				session.subscribe(streams[i], divId);			
			} else if (!properties.publishFull) {
				placePublisher();
			}
		}
	};

	return {
		init: function(_session, _divId, _properties) {
		  session = _session;
		  
		  properties = _properties || {};
		  
		  properties.autoPublish = (properties.hasOwnProperty('autoPublish')) ? properties.autoPublish : true;
		  
		  properties.name = properties.name || '';
		  
		  sizes.container = {};
		  sizes.container.width = (properties.hasOwnProperty('width')) ? properties.width : 640;
		  sizes.container.height = (properties.hasOwnProperty('height')) ? properties.height : 480;
		  
		  properties.publisherSize = properties.publisherSize || 'medium';

      properties.publishFull = properties.publishFull || false;

		  // Create the publisherContainer
		  ele.publisherContainer = document.createElement('div');
		  ele.publisherContainer.setAttribute('id', 'publisherContainer');
		  ele.publisherContainer.style.position = 'absolute';
		  ele.publisherContainer.style.zIndex = 90;
		  ele.publisherContainer.style.visibility = 'hidden';
		  
		  // Create the subscriberBox
		  ele.subscriberBox = document.createElement('div');
		  ele.subscriberBox.setAttribute('id', 'subscriberBox');
		  ele.subscriberBox.style.position = 'absolute';
		  
		  ele.widgetContainer = document.getElementById(_divId);
		  
		  ele.widgetContainer.style.position = 'relative';
		  ele.widgetContainer.style.width = sizes.container.width + 'px';
		  ele.widgetContainer.style.height = sizes.container.height + 'px';
		  
		  ele.widgetContainer.appendChild(ele.publisherContainer);
		  ele.widgetContainer.appendChild(ele.subscriberBox);
		  
		  // Append containers to main divId

			if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
				alert("You don't have the minimum requirements to run this application."
					  + "Please upgrade to the latest version of Flash.");
			} else {

				// Add event listeners to the session
				session.addEventListener('sessionConnected', sessionConnectedHandler);
				session.addEventListener('streamCreated', streamCreatedHandler);
				session.addEventListener('streamDestroyed', streamDestroyedHandler);
        
				// Initialize the layout container
				_OT.layoutContainer.init(ele.subscriberBox.id, sizes.container.width, sizes.container.height); 
			}	
		},
		
		publish: function() {
      		publishStream();
      		return publisher;
      	},
		
		unpublish: unpublishStream,

		destroy: function() {
		  session.removeEventListener('sessionConnected', sessionConnectedHandler);
			session.removeEventListener('streamCreated', streamCreatedHandler);
			session.removeEventListener('streamDestroyed', streamDestroyedHandler);
                
		  // Remove all child divs from the widget
		  if (ele.widgetContainer.hasChildNodes()) {
		    while (ele.widgetContainer.childNodes.length >= 1) {
		      ele.widgetContainer.removeChild(ele.widgetContainer.firstChild);
		    }
		  }
		}
	};  
}();
  
_OT.layoutContainer = function() {
	var Width;

	var Height;

	var containerId;	

	return {
		init: function(divId, width, height){
			containerId = divId;
			Width = width;
			Height = height;
		},

		layout: function(){
			// Set the size of the container
			var subscriberBox = document.getElementById(containerId);
			subscriberBox.style.position = "relative";
			subscriberBox.style.width = Width + "px";
			subscriberBox.style.height = Height + "px";

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

				// All streams placed in absolute position relative to the layout container
				parent.style.position = "absolute"; 

				// Set position and size of the stream container
				parent.style.left = x + "px";
				parent.style.top = y + "px";
				parent.style.width = targetWidth + "px";
				parent.style.height = targetHeight + "px";

				// Set the height and width of the flash object (stream) that sits in the contaienr
				child.width = targetWidth;
				child.height = targetHeight;
			};
		},

		addStream: function(divId, publisher) {
			var container = document.createElement("div");
      container.setAttribute('id', "container-" + divId);

			var div = document.createElement("div");
			div.setAttribute('id', divId);
			container.appendChild(div);

			var subscriberBox = document.getElementById(containerId);
			subscriberBox.appendChild(container);			

      return container;
		},

		removeStream: function(subscriberId) {
			// Gets the container that holds the flash object (stream) and removes it from the page
			var obj = document.getElementById(subscriberId);
			var container = obj.parentNode;
			container.parentNode.removeChild(container);
		}
	};
}();
