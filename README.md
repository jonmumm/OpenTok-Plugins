OpenTok Plugins
===============
This is a set of Javascript plugins for the [OpenTok API](http://www.opentok.com).

_OT.widget
----------
The widget class makes it simple to create a videochat widget similar to the the HTML embed widget seen [here](http://www.tokbox.com/opentok/widgets/basicembed).

[Here](http://jonmumm.github.com/OpenTok-Plugins/Basic.html) is a basic example that uses the _OT.widget class to create a simple videochat widget in less than a dozen lines of code (open that link in multiple tabs to see how it would work with multiple users).

	<div id='widgetContainer' style='background: #222'></div>

	<script type='text/javascript'>

		// Set OpenTok variables
		var session = TB.initSession('28757622dbf26a5a7599c2d21323765662f1d436');
		var api_key = '1127';
		var token = 'devtoken';
	
		var widget = _OT.widget;
	
		// Initialize the widget and pass it properties
		widget.init(session, 'widgetContainer', { width: '500', height: '400', publisherSize: 'medium', name: 'OpenTok User 123' });
	
		// Connect to the session
		session.connect(api_key, token);
	
	</script>

Browse the [Samples directory](https://github.com/jonmumm/OpenTok-Plugins/tree/master/Samples) to see how to use the _OT.widget class.

### Methods

* _init(session, divId, properties)_
	Initializes the widget, publishes the users stream, and subscribes to all other streams.  This should be called _before_ Session.connect() is called.

	**Parameters**  
	_session_: OpenTok Session object.  
	_divId_: ID of the DIV that will contain the widget.  
	_properties_: List of properties for changing the display of the widget.

	* _width_: Width in pixels of the widget (default: _640_).
	* _height_: Height in pixels of the widget (default: _480_).
	* _publisherSize_: Size that the publisher is displayed at.  Accepts values 'small', 'medium', and 'large' (default: '_medium_').
	* _name_: String name of the publisher (default: '').
	* _autoPublish_: Boolean value on whether the widget should start publishing as soon as the session connects (default: _false_);

* publish(properties)  
	Publishes the users stream to the session.  You only need to call this if you pass _{ autoPublish: false }_ as a property in init().

	**Parameters**
	_properties_: List of properties for changing the display of the widget.

	* _publisherSize_: Size that the publisher is displayed at.  Accepts values 'small', 'medium', and 'large' (default: '_medium_').
	* _name_: String name of the publisher (default: '').

* _unpublish()_
	Unpublishes the users stream.

* _destroy() _ 
	Removes all streams from the widget.