<?php

// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Home Info Hub, Version 0.4</title>
	
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-route.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-animate.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-aria.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-cookies.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-loader.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-messages.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-resource.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-sanitize.min.js"></script>
		
    	<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
    	<script src="app\js\app.js"></script>
</head>

<body ng-app="hihApp">
	<!-- Main content area begins -->
	<div id="divMainContent" >
		<!--  Login part first -->
		<div ng-view>
		</div>
	</div>
	<!-- Main content area ends -->
	
	<!-- Footer area begins -->
	<div id="footer" align="center">
		<div><span data-i18n="Common.Copyright">Copyright</span> © 2014 - 2015 Alva Chien</div>
		<div><a href="https://github.com/alvachien/hih">HIH on Github</a></div>
	</div>
	<!-- Footer area ends -->
</body>
</html>
