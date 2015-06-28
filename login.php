<?php

// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();

if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
	header ( "location: index.php" );
	exit ();
}
?>

<!DOCTYPE html>
<html>
	<head>
    	<meta charset="utf-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1">
    	<meta name="description" content="HIH, Version 0.4">
    	<meta name="author" content="Alva Chien">
    	
		<title>Home Info Hub, Version 0.4</title>
	
		<!-- JS part -->
		<!-- Angular JS -->
		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular.min.js"></script>
 		<script src="http://apps.bdimg.com/libs/angular.js/1.4.0-beta.4/angular-animate.min.js"></script>
		<!-- jQuery -->
    	<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
		<!-- Bootstrap -->
		<script src="http://apps.bdimg.com/libs/bootstrap/3.3.4/js/bootstrap.min.js"></script>
		<!-- Angular UI - UIRoute -->
		<Script src="app\3rdparty\angular-ui-router.min.js"></Script>
    	<!-- Application part -->
    	<script src="app\controllers\login.js"></script>
		
		<!-- CSS part -->
		<!-- Bootstrap -->
		<link href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
		<link href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap-theme.min.css" rel="stylesheet">
		<!-- Application part -->
		<link href="app\css\login.css" rel="stylesheet">
		<link href="app\css\register.css" rel="stylesheet">
</head>

<body ng-app="hihLogin">
	<!-- Main content area begins -->
	<div class="container" ui-view>	
	</div>
	<!-- Main content area ends -->
	
	<!-- Dialog for showing info/error/warning begins -->
	<div class="container" ng-controller="MessageBoxController">
		<div class="modal fade" id="dlgMessage">
	  		<div class="modal-dialog">
	    		<div class="modal-content">
	      			<div class="modal-header">
	        			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 class="modal-title">{{MessageHeader}}</h4>
	      			</div>
	      			<div class="modal-body">
	        			<p>{{MessageDetail}}</p>
	      			</div>
	      			<div class="modal-footer">
	        			<button type="button" class="btn btn-default btn-primary" data-dismiss="modal">Close</button>
	      			</div>
	    		</div><!-- /.modal-content -->
	  		</div><!-- /.modal-dialog -->
		</div><!-- /.modal -->
	</div>
	<!-- Dialog for showing info/error/warning ends -->
	
	<!-- Footer area begins -->
    <footer class="footer">
      <div class="container">
        <p class="text-muted">
        	<div><span data-i18n="Common.Copyright">Copyright</span> © 2014 - 2015 Alva Chien</div>
        	<div>An open source project on GitHub: <a href="https://github.com/alvachien/hih">HIH</a></div>
        </p>
      </div>
    </footer>
	<!-- Footer area ends -->
</body>
</html>

