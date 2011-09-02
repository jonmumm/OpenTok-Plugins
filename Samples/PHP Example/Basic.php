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

  // In this case this sessionId is pre-generated and inserted here.
  // Alternatively you could generate one and store it in your database.
  $sessionId = '142d24bb826a0e65ecd4c93b57d0d99f8c4fb3ce'; // Insert your sessionId

  // Some logic here to determine who is a publisher
  $moderator = true;

  // Generate token depending on user permissions
  if ($moderator) {
    $token = $apiObj->generate_token($sessionId, RoleConstants::PUBLISHER); 
  } else {
    $token = $apiObj->generate_token($sessionId, RoleConstants::SUBSCRIBER);
  }
?>
	<div id='widgetContainer' style='background: #222'></div>
	
	<script type='text/javascript'>
	
		// Set OpenTok variables
    var session = TB.initSession('<?php print $sessionId; ?>');
    var api_key = '<?php print API_Config::API_KEY; ?>';
    var token = '<?php print $token; ?>';

		var widget = _OT.widget;

    TB.setLogLevel(TB.DEBUG);
		
		// Initialize the widget and pass it properties
		widget.init(session, 'widgetContainer', { width: '500', height: '400', publisherSize: 'medium', name: 'OpenTok User 123', publishFull: false });
		
		// Connect to the session
		session.connect(api_key, token);
		
	</script>

</body>
</html>
