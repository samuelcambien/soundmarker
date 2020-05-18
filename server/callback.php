<?php

session_start();
require_once('credentials.php');
require('helpers/oauth.php');

/**
 * Check if there is an error present
 */
if(isset($_GET["error"]))
  die(@$_GET["error_description"]);

// Load the client class
$client = new OAuthClient($config);

/**
 * If there is a $_GET parameter "code", we must assume that the user has been authoricated and that
 * the OAuth Server is giving us an "Access Code" that we can use to obtain an access token.
 *
 * Once we have an Access Code present we can simply request an access_token.
 * - Access Codes are only valid for a maximum of 10 minutes. Please refer to the OAuth Server for it spcific speficatons.
 */
if( isset( $_GET['code'] ) ) {

  $curl_post_data = array(
     'grant_type'    => 'authorization_code',
     'code'          => $_GET['code'],
     'redirect_uri'  => $config['PHPSERVER_URL'].'callback.php',
     'client_id'     => $config['OAUTH_CLIENT_ID'], // Only needed if server is running CGI
     'client_secret' => $config['OAUTH_CLIENT_SECRET'] // Only need if server is running CGI
  );

  $curl = curl_init( $config['OAUTH_SERVER_LOCATION'] . '/oauth/token/' );

  // Uncomment if you want to use CLIENTID AND SECRET IN THE HEADER
  //curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  //curl_setopt($curl, CURLOPT_USERPWD, $client_id.':'.$client_secret); // Your credentials goes here
  curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
  curl_setopt( $curl, CURLOPT_POST, true );
  curl_setopt( $curl, CURLOPT_POSTFIELDS, $curl_post_data );
  curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
  curl_setopt( $curl, CURLOPT_VERBOSE, true);
  curl_setopt( $curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5' );
  curl_setopt( $curl, CURLOPT_REFERER, $config['OAUTH_SERVER_LOCATION'].'/1' );

  $curl_response = curl_exec( $curl );
  curl_close( $curl );

  /** OPTION but RECOMMENDED - STORAGE */
  // Store the access token, refresh token as well as exiration from information gathered from the 
  // OAuth Server. Here the example simple adds the entire respose from the OAuth Server into a 
  // session. One could also save the this information to a database so it can be used later.
  // An access_token is only good as long as the OAuth Server specifies. 
  if (isset(json_decode($curl_response)->access_token)) {
    $_SESSION['USER'] = $curl_response;
    $now = new DateTime();
    $_SESSION['ENDTIME'] = $now->getTimestamp() + 60*60*24;
    $response = getSubscriptions(json_decode($curl_response)->access_token, $config, $now);
    $_SESSION["status"] = "pro";
  }
  
  // Once you have an access token, you know that user has signed in sucessfully and that they have
  // authorized your application (if scope is supported). Here is where you can call the resource server
  // and get user informaiton about the user. What you do with this information is up to you.
  header("Location: ".$config['PHPSERVER_URL']);  
  
}
