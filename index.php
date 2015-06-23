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
    	<meta charset="utf-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1">
    	<meta name="description" content="">
    	<meta name="author" content="Alva Chien">
    	
		<title>Home Info Hub, Version 0.4</title>
	
		<!-- JS part -->
		<!-- Angular JS -->
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-route.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-animate.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-messages.min.js"></script>
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-resource.min.js"></script>
		<!-- jQuery -->
    	<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
		<!-- Bootstrap -->
		<script src="http://apps.bdimg.com/libs/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    	<!-- Application part -->
    	<script src="app\controllers\app.js"></script>
		
		<!-- CSS part -->
		<!-- Bootstrap -->
		<link href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
		<link href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap-theme.min.css" rel="stylesheet">
		<!-- Application part -->
		<link href="app\css\app.css" rel="stylesheet">		
		<link href="app\css\login.css" rel="stylesheet">
		<link href="app\css\register.css" rel="stylesheet">
</head>

<body ng-app="hihApp">
	<!-- Navigation area begins -->
	<nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Home Info . Hub</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li class="dropdown-header">Nav header</li>
                <li><a href="#">Separated link</a></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="../navbar/">Default</a></li>
            <li><a href="../navbar-static-top/">Static top</a></li>
            <li class="active"><a href="./">Fixed top <span class="sr-only">(current)</span></a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
 	<!-- Navigation area ends -->
    
	<!-- Main content area begins -->
	<div class="container" ng-view>	
	</div>
	<!-- Main content area ends -->
	
	<!-- Footer area begins -->
    <footer class="footer">
      <div class="container">
        <p class="text-muted">
        	<div><span data-i18n="Common.Copyright">Copyright</span> © 2014 - 2015 Alva Chien</div>
        	<div>Open source project on GitHub: <a href="https://github.com/alvachien/hih">HIH</a></div>
        </p>
      </div>
    </footer>
	<!-- Footer area ends -->
</body>
</html>
