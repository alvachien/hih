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
    	<meta name="description" content="HIH, Version 0.4">
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
		<!-- Smart-Table -->
		<Script src="app\3rdparty\smart-table.min.js"></Script>
    	<!-- Application part -->
    	<script src="app\controllers\app.js"></script>
    	<script src="app\controllers\login.js"></script>
    	<script src="app\controllers\learn.js"></script>
		
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
	<nav class="navbar navbar-default navbar-fixed-top" ng-controller="NavController as navctrl" ng-show="isLogin">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#/home">Home Info . Hub</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
          	<li class="dropdown">
            	<a href="#/home" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Home<span class="caret"></span></a>
            	<ul class="dropdown-menu">
            		<li><a href="" ng-click="logout()">Logout</a></li>
            	</ul>
          	</li>
            <li class="dropdown">
            	<a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Learning Part<span class="caret"></span></a>
            	<ul class="dropdown-menu">
            		<li><a href="#/learnobject">Learn Object</a></li>
            		<li><a href="#/learnhistory">Learn History</a></li>
            		<li><a href="#/learnaward">Learn Award</a></li>
            	</ul>
            </li>
            <li class="dropdown">
            	<a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Finance Part<span class="caret"></span></a>
            	<ul class="dropdown-menu">
            		<li><a href="#/financeaccount">Accounts</a></li>
            		<li><a href="#/financedocument">Document</a></li>
            	</ul>
            </li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li class="dropdown">
              <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Acknowledges<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="https://www.angularjs.org/">Angular JS</a></li>
                <li><a href="http://getbootstrap.com/">Bootstrap</a></li>
                <li><a href="https://github.com/lorenzofox3/Smart-Table">Smart-Table</a></li>
                <li role="separator" class="divider"></li>
                <li class="dropdown-header">CDNs</li>
                <li><a href="http://cdn.code.baidu.com/">Baidu CDN</a></li>
                <li><a href="">One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
	            <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Languages<span class="caret"></span></a>	            	
              	<ul class="dropdown-menu">
              		<li><a href="">English</a></li>
              		<li><a href="">Chinese</a></li>
              	</ul>
	          </li>
            <li class="dropdown">
	            <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Themes<span class="caret"></span></a>	            	
              	<ul class="dropdown-menu">
              		<li><a href="">Default</a></li>
              		<li><a href="">More to come....</a></li>
              	</ul>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
 	<!-- Navigation area ends -->
    
	<!-- Main content area begins -->
	<div class="container" ng-view>	
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
