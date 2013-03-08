<?php
/*
	Error handler - returns error message in JSON
*/

set_error_handler('errorHandler');

function errorHandler($errno, $errstr ,$errfile, $errline, $errcontext)
{
    $agent       = $_SERVER['HTTP_USER_AGENT'];
	$referrer 	 = $_SERVER['HTTP_REFERER'];

    $error = array(
        'error'=>$errstr,
        'error_file'=>basename($errfile),
        'error_line'=>$errline,
        'agent' => $agent,
        'referrer' => $referrer,
        'sql' => $sql
        );

	$json= json_encode( $error );
	echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

	exit;
}

?>
