<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>Widget Sample - Basic</title>
	<script src="http://staging.tokbox.com/v0.91/js/TB.min.js"></script>
	<script src='../../_OT.js'></script>
</head>

<body>

<?php

  require_once 'SDK/API_Config.php';
  require_once 'SDK/OpenTokSDK.php';

  $apiObj = new OpenTokSDK(API_Config::API_KEY, API_Config::API_SECRET);

  // Use GenerateSession.php to generate a sessionId to use for everybody
  // Alternatively you could generate sessions here and store them in your database
  $sessionId = '142d24bb826a0e65ecd4c93b57d0d99f8c4fb3ce'; // Insert your sessionId

?>
	<div id='widgetContainer' style='background: #222'></div>
	
	<script type='text/javascript'>
	
		// Set OpenTok variables
    var session = TB.initSession('<?php print $sessionId; ?>');
    var api_key = '<?php print API_Config::API_KEY; ?>';
    var token = '<?php print $apiObj->generate_token($sessionId); ?>';

		var widget = _OT.widget;
		
		// Initialize the widget and pass it properties
		widget.init(session, 'widgetContainer', { width: '500', height: '400', publisherSize: 'medium', name: 'OpenTok User 123', publishFull: false });
		
		// Connect to the session
		session.connect(api_key, token);
		
	</script>

</body>
</html>
