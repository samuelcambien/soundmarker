<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';
require 'credentials.php';
require 'helpers/uuid.php';

/*
GLOBALE DECLARATIONS
*/
///////////////////////////////////////////////////////////////// Setup DB ////////////////////////////////////////////////////////////
Flight::set("config", $config);
Flight::register('db', 'PDO', array('mysql:host='.$config["RDS_HOSTNAME"].';dbname='.$config["RDS_DB_NAME"], $config["RDS_USERNAME"], $config["RDS_PASSWORD"]), function($db) {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
});

////////////////////////////////////////////////////////////// Setup S3 client ////////////////////////////////////////////////////////
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

$s3 = new Aws\S3\S3Client([
    'profile'     => 's3',
    'version'     => 'latest',
    'region'      => $config['AWS_S3_REGION'],
    'scheme' => 'http',
]);

Flight::set("s3", $s3);

///////////////////////////////////////////////////////////// Setup SES client ////////////////////////////////////////////////////////
use Aws\Ses\SesClient;
use Aws\Exception\AwsException;

$SesClient = new SesClient([
    'profile' => 'ses',
    'version' => '2010-12-01',
    'region'  => 'eu-west-1',
]);

Flight::set("SesClient", $SesClient);

ini_set("default_socket_timeout", 4000);
if(!isset($_SESSION)) {
  /* set the cache limiter to 'private' */
  // session_cache_limiter('private');
  // $cache_limiter = session_cache_limiter();

  //  set the cache expire to 30 minutes
  // session_cache_expire(1440);
  // $cache_expire = session_cache_expire();
  session_start(); 
} 
if (isset($_SESSION["USER"])) {
$access_token = json_decode($_SESSION["USER"])->access_token;
}

// Error handling
Flight::map('error', function(Exception $ex){
    // Handle error
    Flight::json(array(
       'error' => $ex->getTraceAsString()
    ), 400);
});































/*
ROUTING TO FRONT-END
*/
/////////////////////////////////////////////////////////// Routes - Global Index /////////////////////////////////////////////////////
Flight::route('/', function(){

$config = Flight::get("config");
$now = new DateTime();
// initialize
if(!isset($_SESSION)) 
{ 
  session_start(); 
} 
require 'helpers/oauth.php';

if (isset($_SESSION["status"]) && isset($_SESSION['ENDTIME'])) {
  if ($_SESSION["status"] != "free") {
    if ($_SESSION['ENDTIME'] < $now->getTimestamp() OR $_SESSION["status"] == "") {
      $access_token = json_decode($_SESSION["USER"])->access_token;
      $response = getSubscriptions($access_token, $config, $now);
      if ($response->error) { 
        if (isset(json_decode($_SESSION["USER"])->refresh_token)) {
        // get refresh token
        $curl_post_data = array(
           'grant_type'    => 'refresh_token',
           'refresh_token' => json_decode($_SESSION["USER"])->refresh_token,
           'client_id'     => $config['OAUTH_CLIENT_ID'], // Only needed if server is running CGI
           'client_secret' => $config['OAUTH_CLIENT_SECRET'] // Only need if server is running CGI
        );

        $curl = curl_init( $config['oauth_server_location'] . '/oauth/token/' );

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

          if (isset(json_decode($curl_response)->access_token)) {
            $_SESSION['USER'] = $curl_response;
            $_SESSION['ENDTIME'] = $now->getTimestamp() + 60*60*24;
            $response = getSubscriptions($access_token);
            header("Refresh:0");
          } else {
            $_SESSION["status"] = "free";
          }
        } else {
          $_SESSION["status"] = "free";
        }
      } 
    }
  } 
}
include 'index.html';
});











/*
PROJECT
*/
//////////////////////////////////////////////////////// Routes - /project/new POST ///////////////////////////////////////////////////
Flight::route('POST /project/new', function() {

$config = Flight::get("config");
// Todo: check if user_id exists first (foreign_key needs to be valid) -> put in dB
$getbody = json_decode(Flight::request()->getBody());

$user_id = isset($_SESSION['USER']) ? $_SESSION['USER'] : "";
$project_title = isset($getbody->project_title) ? $getbody->project_title : "";
$project_password = isset($getbody->project_password) ? $getbody->project_password : "";
$ipaddr = $_SERVER['REMOTE_ADDR'] . " - " . $_SERVER['HTTP_X_FORWARDED_FOR'];

$db = Flight::db();
$sql = "INSERT INTO Project (user_id, title, password, active, ipaddr) VALUES ('$user_id', '$project_title', '$project_password', '1', '$ipaddr')";
$result = $db->query($sql);
$project_id = $db->lastInsertId();

$uuid = UUID::v4().UUID::v4();
$sql = "UPDATE Project SET hash = '$uuid' WHERE project_id = '$project_id'";
$result = $db->query($sql);

$_SESSION['user_projects'][] = $project_id;

// return ok
Flight::json(array(
   'project_id' => $project_id
), 200);
});

//////////////////////////////////////////////////////// Routes - /project/edit POST ///////////////////////////////////////////////////
Flight::route('POST /project/edit', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$project_id = isset($getbody->project_id) ? $getbody->project_id : "";
$project_title = isset($getbody->project_title) ? $getbody->project_title : "";
$project_password = isset($getbody->project_password) ? $getbody->project_password : "";

// if user is able to edit this project -> update with user permissions
if (true) {
  $db = Flight::db();
  $sql = "UPDATE Project SET title = '$project_title' WHERE project_id = '$project_id'";
  $result = $db->query($sql);
  $sql = "UPDATE Project SET password = '$project_password' WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  // return ok
  Flight::json(array(
     'return' => 'ok'
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

//////////////////////////////////////////////////////// Routes - /project/all GET ///////////////////////////////////////////////////
Flight::route('GET /project/all', function() {

$config = Flight::get("config");

$db = Flight::db();
$user_id = isset($_SESSION['USER']) ? $_SESSION['USER'] : "";
if (isset($_SESSION['USER'])) {
  $sql = "SELECT project_id, title, expiration_date, hash FROM Project WHERE user_id = '$user_id' AND active = '1'";
  $result = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

  // return ok
  Flight::json(array(
     'projects' => $result
  ), 200);
} else {
  // return ok
  Flight::json(array(
     'return' => 'notloggedin'
  ), 200);
}

});

//////////////////////////////////////////////// Routes - /project/get/@project_hash POST /////////////////////////////////////////////
Flight::route('POST /project/get/url', function() {

$config = Flight::get("config");
// calculate amount of tracks and get track names
$getbody = json_decode(Flight::request()->getBody());

$project_id = isset($getbody->project_id) ? $getbody->project_id : "";
$sender = isset($getbody->sender) ? $getbody->sender : "";
$receiver = isset($getbody->receiver) ? $getbody->receiver : "";
$expiration = isset($getbody->expiration) ? $getbody->expiration : "1 week";
// check notes????
$notes = isset($getbody->notes) ? $getbody->notes : "";

// if user is able to edit this project -> update with user permissions
if (true) {
  $db = Flight::db();
  // Update expiration date
  $projectdate = new \DateTime('+'.$expiration);
  $projectdatef = $projectdate->format('Y-m-d H:i:s');
  $sql = "UPDATE Project SET expiration_date = '$projectdatef' WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
  $result = $db->query($sql);
  $hash = $result->fetch()[0];

  // only send if opted in for email
  if ($receiver) {
    // https://www.functions-online.com/htmlentities.html
    // htmlentities('', ENT_COMPAT, 'ISO-8859-1');
    // html_entity_decode('', ENT_COMPAT, 'ISO-8859-1');
    // Send Email to Sender
    $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-initial-email-to-sender'";
    $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-initial-email-to-sender'";
    $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    
    // Replace strings
    // Replace strings -> %projectdate%
    $emailstring = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring);
    $emailstring_text = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring_text);
    // Replace strings -> %projectlink%
    $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
    $projectlink = $config['SERVER_URL']."/project/" . $db->query($sql)->fetch()[0];
    $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
    $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
    // Replace strings -> %recipientmail%
    $emailstring = str_replace("%recipientmail%",implode("<br>", $receiver),$emailstring);
    $emailstring_text = str_replace("%recipientmail%",implode("\n", $receiver),$emailstring_text);
    // Replace strings -> %trackamount%
    $sql = "SELECT track_id FROM Track WHERE project_id = '$project_id'";
    $tracks = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    foreach ($tracks as &$track) {
        $trackid = $track["track_id"];
        $sqlversion = "SELECT version_id FROM Version WHERE track_id = '$trackid'";
        $versions[] = $db->query($sqlversion)->fetchAll(PDO::FETCH_ASSOC);
    }
    foreach ($versions as &$versions2) {
      foreach ($versions2 as &$version) {
          $versionid = $version["version_id"];
          $sqlfiles = "SELECT file_name FROM File WHERE version_id = '$versionid'";
          $files[] = $db->query($sqlfiles)->fetchAll(PDO::FETCH_ASSOC)[0];
      }
    }
    if (count($files) == 1) {
      $trackcount = count($files). " track";
    } else {
      $trackcount = count($files). " tracks";
    }
    $emailstring = str_replace("%trackamount%",$trackcount,$emailstring);
    $emailstring_text = str_replace("%trackamount%",$trackcount,$emailstring_text);   
    // Replace strings -> %tracktitle%
    $tracktitle = "";
    foreach ($files as &$file) {
        $tracktitle .= $file["file_name"] . "<br>";
    }
    $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
    $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   

    $subject = 'Your tracks have been shared successfully via Soundmarker';
    $char_set = 'UTF-8';

    try {
        $result = Flight::get("SesClient")->sendEmail([
            'Destination' => [
                'ToAddresses' => [$sender],
            ],
            'ReplyToAddresses' => ["noreply@soundmarker.com"],
            'Source' => "Soundmarker <noreply@soundmarker.com>",
            'Message' => [
              'Body' => [
                  'Html' => [
                      'Charset' => $char_set,
                      'Data' => $emailstring,
                  ],
                  'Text' => [
                      'Charset' => $char_set,
                      'Data' => $emailstring_text,
                  ],
              ],
              'Subject' => [
                  'Charset' => $char_set,
                  'Data' => $subject,
              ],
            ],
        ]);
        $messageId = $result['MessageId'];
    } catch (AwsException $e) {
        // output error message if fails
        echo $e->getMessage();
        echo("The email was not sent. Error message: ".$e->getAwsErrorMessage()."\n");
    }

    // Send Email to Recipient
    $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
    $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
    $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    
    // Replace strings
    // Replace strings -> %projectdate%
    $emailstring = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring);
    $emailstring_text = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring_text);
    // Replace strings -> %projectlink%
    $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
    $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
    // Replace strings -> %recipientmail%
    $emailstring = str_replace("%recipientmail%",implode("\n", $receiver),$emailstring);
    $emailstring_text = str_replace("%recipientmail%",implode("\n", $receiver),$emailstring_text);
    // Replace strings -> %trackamount%
    $emailstring = str_replace("%trackamount%",$trackcount,$emailstring);
    $emailstring_text = str_replace("%trackamount%",$trackcount,$emailstring_text);   
    // Replace strings -> %tracktitle%
    $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
    $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   
    // Replace strings -> %projectnotes%
    $emailstring = str_replace("%projectnotes%",urldecode($notes),$emailstring);
    $emailstring_text = str_replace("%projectnotes%",urldecode($notes),$emailstring_text);   
    // Replace strings -> %sendermail%
    $emailstring = str_replace("%sendermail%",$sender,$emailstring);
    $emailstring_text = str_replace("%sendermail%",$sender,$emailstring_text);   

    $subject = $sender . ' has shared '. $trackcount . ' with you via Soundmarker';
    $char_set = 'UTF-8';

    try {
        foreach ($receiver as &$receiveremail) {
        $result = Flight::get("SesClient")->sendEmail([
            'Destination' => [
                'ToAddresses' => [$receiveremail],
            ],
            'ReplyToAddresses' => [$sender],
            'Source' => "Soundmarker <noreply@soundmarker.com>",
            'Message' => [
              'Body' => [
                  'Html' => [
                      'Charset' => $char_set,
                      'Data' => $emailstring,
                  ],
                  'Text' => [
                      'Charset' => $char_set,
                      'Data' => $emailstring_text,
                  ],
              ],
              'Subject' => [
                  'Charset' => $char_set,
                  'Data' => $subject,
              ],
            ],
        ]);
        // $messageId = $result['MessageId'];
        }
    } catch (AwsException $e) {
        // output error message if fails
        echo $e->getMessage();
        echo("The email was not sent. Error message: ".$e->getAwsErrorMessage()."\n");
    }

    // Create notifications
    // Notification -> Expired
    $senddate = $projectdate->modify('-3 days');
    $senddatef = $senddate->format('Y-m-d H:i:s');
    $db = Flight::db();
    $receiverstring = implode("\n", $receiver);
    $sql = "INSERT INTO Notification (emailaddress, senddate, type, status, type_id, recipientemail) VALUES ('$sender', '$projectdatef', '0', '0', '$project_id', '$receiverstring')";
    $result = $db->query($sql);

    // Create DailyUpdates in dB
    $sql = "INSERT INTO DailyUpdates (emailaddress, project_id) VALUES ('$sender', '$project_id')";
    $result = $db->query($sql);
  }

  // return ok
  Flight::json(array(
     'project_hash' => $hash
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

/////////////////////////////////////////////////////// Routes - /project/subscribe GET ///////////////////////////////////////////////////////

Flight::route('POST /project/subscribe', function() {

// Check if user is allowed to get that info
$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$emailaddress = $getbody->emailaddress;
$project_id = $getbody->project_id;

$db = Flight::db();
$sql = "INSERT INTO DailyUpdates (project_id, emailaddress) VALUES ('$project_id', '$emailaddress')";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'return' => "ok"
), 200);
});


//////////////////////////////////////////////// Routes - /project/get/@project_hash GET /////////////////////////////////////////////
Flight::route('GET /project/get/@project_hash', function($project_hash) {

$config = Flight::get("config");
$db = Flight::db();
$sql = "SELECT project_id, active, expiration_date, user_id, password FROM Project WHERE hash = '$project_hash'";
$response = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

$project_id = $response[0]["project_id"];
$active = $response[0]["active"];
$expiration_date = $response[0]["expiration_date"];
$user_id = $response[0]["user_id"];
$project_password = $response[0]["password"];

$lastmonth = new \DateTime('-1 month');
$lastmonthf = $lastmonth->format('Y-m-d H:i:s');
$currentmonth = new \DateTime();
$currentmonthf = $currentmonth->format('Y-m-d H:i:s');

if ($user_id) {
  $status = "pro";
} elseif ($active == 0) {
  $status = "inactive";
} elseif ($expiration_date < $lastmonthf) {
  $status = "expired";
} elseif ($expiration_date < $currentmonthf) {
  $status = "commentsonly";
} else {
  $status = "active";
}

$sql = "SELECT track_id, title FROM Track WHERE project_id = '$project_id'";
$result = $db->query($sql);
$tracks = $result->fetchAll(PDO::FETCH_ASSOC);
if ($status == "expired") {
  $tracks = "";
}

// if project is password protected
if ($project_password) {
  if (true) {
    $_SESSION['view_user_projects'][] = $project_id;
    // return ok
    Flight::json(array(
       'project_id' => $project_id, 'status' => $status, 'tracks' => $tracks
    ), 200);  
  } else {
    // return ok
    Flight::json(array(
       'return' => 'passwordmissing'
    ), 200);  
  }
} else {
  $_SESSION['view_user_projects'][] = $project_id;

  // also send sender
  $sql = "SELECT emailaddress, user_id FROM Notification WHERE type = '0' AND type_id = '$project_id'";
  $response = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  // if only link is created, then no sender
  if (isset($response[0])) {
    $emailaddress = $response[0]["emailaddress"];
  } else {
    $emailaddress = "";
  }

  // return ok
  Flight::json(array(
     'project_id' => $project_id, 'status' => $status, 'expiration' => $expiration_date, 'sender' => $emailaddress, 'tracks' => $tracks
  ), 200);  
}
});

//////////////////////////////////////////////// Routes - /project/set/viewpassword POST /////////////////////////////////////////////
Flight::route('POST /project/set/viewpassword', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());
$project_id = $getbody->project_id;
$project_password = $getbody->password;

$db = Flight::db();
$sql = "SELECT password FROM Project WHERE project_id = '$project_id'";
$result = $db->query($sql);

if ($result->fetch()[0] == $project_password) {
    $_SESSION['approved_user_projects'][] = $project_id;
    Flight::json(array(
     'return' => 'ok'
    ), 200);
} else {
    Flight::json(array(
     'return' => 'nook'
    ), 200);    
}
});

///////////////////////////////////////////////////// Routes - /project/password POST /////////////////////////////////////////////////
Flight::route('POST /project/password', function() {

// Check if user_projects
$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());
$project_id = $getbody->project_id;

// if user is able to edit this project password
if (true) {
  $db = Flight::db();
  $sql = "SELECT password FROM Project WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  Flight::json(array(
     'project_id' => $project_id,
     'project_password' => $result->fetch()[0] 
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

//////////////////////////////////////////////////// Routes - /project/delete POST ////////////////////////////////////////////////////
Flight::route('POST /project/delete', function() {

// Check if user projects
$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());
$project_id = $getbody->project_id;

// if user is able to edit this project password
if (true) {
  $db = Flight::db();
  $sql = "UPDATE Project SET active = '0' WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  // return ok
  Flight::json(array(
     'project_id' => $project_id
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

//////////////////////////////////////////////////// Routes - /project/url POST ///////////////////////////////////////////////////////
Flight::route('POST /project/url', function() {

// Check if user projects
$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());
$project_id = $getbody->project_id;

// if user is able to edit this project password
if (true) {
  $db = Flight::db();
  $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  // return ok
  Flight::json(array(
     'project_url' => $config['SERVER_URL'].'/project/'. $result->fetch()[0],
     'project_hash' => $result->fetch()[0]
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

/////////////////////////////////////////////// Routes - /project/@project_hash POST //////////////////////////////////////////////////
Flight::route('/project/@project_hash', function(){
    include 'index.html';
});










/*
TRACK
*/
/////////////////////////////////////////////////////// Routes - /track/new POST //////////////////////////////////////////////////////
Flight::route('POST /track/new', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$project_id = $getbody->project_id;
$track_title = isset($getbody->track_title) ? $getbody->track_title : "";
$track_artist = isset($getbody->track_artist) ? $getbody->track_artist : "";
$visibility = isset($getbody->visibility) ? $getbody->visibility : 1;

// if user is able to edit this project password
if (true) {
  $db = Flight::db();
  if ($project_id) {
      $sql = "INSERT INTO Track (title, artist, project_id, visibility) VALUES ('$track_title', '$track_artist', '$project_id', '$visibility')";
  } else {
      $sql = "INSERT INTO Track (title, artist, visibility) VALUES ('$track_title', '$track_artist', '$visibility')";
  }
  $result = $db->query($sql);

  $_SESSION['user_tracks'][] = $db->lastInsertId();

  // return ok
  Flight::json(array(
     'track_id' => $db->lastInsertId()
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

/////////////////////////////////////////////////////// Routes - /track/visibility POST //////////////////////////////////////////////////////
Flight::route('POST /track/visibility', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$track_id = $getbody->track_id;
$visibility = isset($getbody->visibility) ? $getbody->visibility : 1;

// if user is able to edit this project
if (true) {
  $db = Flight::db();
  $sql = "UPDATE Track SET visibility = '$visibility' WHERE track_id = '$track_id'";
  $result = $db->query($sql);

  // $_SESSION['user_tracks'][] = $db->lastInsertId();

  // return ok
  Flight::json(array(
     'return' => 'ok'
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

//////////////////////////////////////////////////// Routes - /track/version POST /////////////////////////////////////////////////////
Flight::route('POST /track/version', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$track_id = $getbody->track_id;
$downloadable = isset($getbody->downloadable) ? $getbody->downloadable : 0;
$visibility = isset($getbody->visibility) ? $getbody->visibility : 1;
$notes = isset($getbody->notes) ? $getbody->notes : "";
$version_title = isset($getbody->version_title) ? $getbody->version_title : "";
$track_length = isset($getbody->track_length) ? $getbody->track_length : 0;
// $wave_png = isset($getbody->wave_png) ? json_encode($getbody->wave_png) : "";

// if user is able to edit this track
if (true) {
  $db = Flight::db();
  $sql = "INSERT INTO Version (track_id, downloadable, visibility, notes, version_title, track_length) VALUES ('$track_id', '$downloadable', '$visibility', '$notes', '$version_title', '$track_length')";
  $result = $db->query($sql);

  $_SESSION['user_versions'][] = $db->lastInsertId();

  // return ok
  Flight::json(array(
     'version_id' => $db->lastInsertId()
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});


//////////////////////////////////////////////////// Routes - /track/version/edit POST /////////////////////////////////////////////////////
Flight::route('POST /track/version/edit', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$version_id = isset($getbody->version_id) ? $getbody->version_id : "";
$downloadable = isset($getbody->downloadable) ? $getbody->downloadable : 0;
$visibility = isset($getbody->visibility) ? $getbody->visibility : 1;
$notes = isset($getbody->notes) ? $getbody->notes : "";
$version_title = isset($getbody->version_title) ? $getbody->version_title : "";
// $track_length = isset($getbody->track_length) ? $getbody->track_length : 0;
// $wave_png = isset($getbody->wave_png) ? json_encode($getbody->wave_png) : "";

// if user is able to edit this track
if (true) {
  $db = Flight::db();

  $sql = "UPDATE Version SET notes = '$notes', version_title = '$version_title', visibility = '$visibility', downloadable = '$downloadable' WHERE version_id = '$version_id'";
  $result = $db->query($sql);

  // $_SESSION['user_versions'][] = $db->lastInsertId();

  // return ok
  Flight::json(array(
     'version_id' => $db->lastInsertId()
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

///////////////////////////////////////////////////////// Routes - /track GET /////////////////////////////////////////////////////////
Flight::route('GET /track/@track_id', function($track_id) {

$config = Flight::get("config");
$db = Flight::db();
$sql = "SELECT version_id, notes, downloadable, visibility, version_title, track_length, wave_png FROM Version WHERE track_id = '$track_id'";
$result = $db->query($sql);
$versions = $result->fetchAll(PDO::FETCH_ASSOC);

foreach ($versions as &$version) {
  $_SESSION['view_versions'][] = $version["version_id"];
}

// return ok
Flight::json(array(
   'versions' => $versions
), 200);
});

///////////////////////////////////////////////////// Routes - /track/version GET /////////////////////////////////////////////////////
Flight::route('GET /track/version/@version_id', function($version_id) {

$config = Flight::get("config");
// if user is allow to see this version
if (true) {
  $db = Flight::db();
  $sql = "SELECT file_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE version_id = '$version_id'";
  $result = $db->query($sql);
  $files = $result->fetchAll(PDO::FETCH_ASSOC);

  foreach ($files as &$file) {
    $_SESSION["view_files"][] = $file["file_id"];
  }

  // return ok
  Flight::json(array(
     'files' => $files
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

///////////////////////////////////////////////// Routes - /track/version/comments GET ////////////////////////////////////////////////
Flight::route('GET /track/version/comments/@version_id', function($version_id) {

// if user is allow to see this version
if (true) {
  $config = Flight::get("config");
  $db = Flight::db();
  $sql = "SELECT comment_id, notes, start_time, end_time, checked, parent_comment_id, name, include_end, include_start, comment_time FROM Comment WHERE version_id = '$version_id'";
  $result = $db->query($sql);
  $comments = $result->fetchAll(PDO::FETCH_ASSOC);

  // don't cache
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Pragma: no-cache");

  // return ok
  Flight::json(array(
     'comments' => $comments
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
}
});

///////////////////////////////////////////////// Routes - /track/version/comment POST ////////////////////////////////////////////////
Flight::route('POST /track/version/comment', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$version_id = $getbody->version_id;
$notes = isset($getbody->notes) ? $getbody->notes : "";
$name = isset($getbody->name) ? $getbody->name : "";
$start_time = isset($getbody->start_time) ? $getbody->start_time : "";
$end_time = isset($getbody->end_time) ? $getbody->end_time : "";
$parent_comment_id = isset($getbody->parent_comment_id) ? $getbody->parent_comment_id : "";
$include_start = isset($getbody->include_start) ? $getbody->include_start : "";
$include_end = isset($getbody->include_end) ? $getbody->include_end : "";
$comment_time = isset($getbody->comment_time) ? $getbody->comment_time : "";

// if user is allow to see this version
if (true) {
  $db = Flight::db();
  $sql = "INSERT INTO Comment (version_id, notes, name, start_time, end_time, parent_comment_id, include_start, include_end, comment_time) VALUES ('$version_id', '$notes', '$name', '$start_time', '$end_time', '$parent_comment_id', '$include_start', '$include_end', '$comment_time')";
  $result = $db->query($sql);

  $_SESSION["view_comments"][] = $db->lastInsertId();
  // return ok
  Flight::json(array(
     'comment_id' => $db->lastInsertId()
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
} 
});

///////////////////////////////////////////////// Routes - /track/version/delete/comment POST ///////////////////////////////////////////
Flight::route('POST /track/version/delete/comment', function() {

// Can user delete comments for this version?
$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$comment_id = $getbody->comment_id;

// if user is allow to delete this comment
if (true) {
  $db = Flight::db();
  $sql = "DELETE FROM Comment WHERE comment_id = '$comment_id'";
  $result = $db->query($sql);

  // return ok
  Flight::json(array(
     'return' => 'ok'
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
} 
});


////////////////////////////////////////////////// Routes - /track/file/download GET //////////////////////////////////////////////////
Flight::route('GET /track/file/download/@file_id', function($file_id) {

$config = Flight::get("config");

// if user is allow to view this file
if (true) {
  $db = Flight::db();
  $sql = "SELECT aws_path  FROM File WHERE file_id = '$file_id'";
  $result = $db->query($sql);
  $aws_path = $result->fetch()[0];

  // return ok
  Flight::json(array(
     'aws_path' => $aws_path
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
} 
});








/*
FILE
*/
/////////////////////////////////////////////////////// Routes - /file/new POST ///////////////////////////////////////////////////////
Flight::route('POST /file/new', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$version_id = $getbody->version_id;
$identifier = isset($getbody->identifier) ? $getbody->identifier : 0;
$chunk_length = isset($getbody->chunk_length) ? $getbody->chunk_length : 0;
$file_size = isset($getbody->file_size) ? $getbody->file_size : 0;
$file_name = isset($getbody->file_name) ? $getbody->file_name : "";
$metadata = isset($getbody->metadata) ? $getbody->metadata : "";
$extension = isset($getbody->extension) ? $getbody->extension : "";
$aws_path = urlencode($config['AWS_S3_PATH'].$version_id . "/" . urlencode($file_name));

// if user is able to upload file
if (true) {
  $db = Flight::db();
  $sql = "INSERT INTO File (version_id, file_name, file_size, metadata, extension, chunk_length, identifier, aws_path) VALUES ('$version_id', '$file_name', '$file_size', '$metadata', '$extension', '$chunk_length', '$identifier', '$aws_path')";
  $result = $db->query($sql);

  $_SESSION['user_files'][] = $db->lastInsertId();

  // return ok
  Flight::json(array(
     'file_id' => $db->lastInsertId()
  ), 200);
} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
} 
});

////////////////////////////////////////////////// Routes - /file/chunk/$file_id POST /////////////////////////////////////////////////
Flight::route('POST /file/chunk/@file_id/@download_id/@idno/@ext', function($file_id, $download_id, $idno, $ext) {

$config = Flight::get("config");
ignore_user_abort(true);
set_time_limit(0);

// if user is able to upload file
if (true) {
  $db = Flight::db();
  $sql = "SELECT version_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE file_id = '$file_id'";
  $result = $db->query($sql);
  $files = $result->fetchAll();

  // get the variables
  $s3 = Flight::get("s3");

  // store tmp file.
  $myfile = fopen("/tmp/orig".$file_id.".".$ext, "w") or die("Unable to open file!");
  fwrite($myfile, Flight::request()->getBody());
  fclose($myfile);

  // return ok -> let's try
  Flight::json(array(
     'ok' => 'ok'
  ), 200);

  // now let's see how long the song is
  $ffprobe = FFMpeg\FFProbe::create(array(
      'ffmpeg.binaries'  => $config['FFMPEG_PATH'].'/ffmpeg',
      'ffprobe.binaries' => $config['FFMPEG_PATH'].'/ffprobe',
      'timeout'          => 8000, // The timeout for the underlying process
      'ffmpeg.threads'   => 12,   // The number of threads that FFMpeg should use
  ));
  $duration = $ffprobe
      ->format("/tmp/orig".$file_id.".".$ext) // extracts file informations
      ->get('duration');

  $codec_name = $ffprobe
      ->streams("/tmp/orig".$file_id.".".$ext) // extracts file informations
      ->first()
      ->get('codec_name'); 

   // mkdir folder
   exec("mkdir /tmp/".$file_id);
   // now create segments
   exec($config['FFMPEG_PATH']."/ffmpeg -i /tmp/orig".$file_id.".".$ext." -f segment -segment_time 10 -codec:a libmp3lame -qscale:a 1 /tmp/".$file_id."/".$file_id."%03d.mp3");
   // loop through all files and upload them
   $di = new RecursiveDirectoryIterator('/tmp/'.$file_id);
    foreach (new RecursiveIteratorIterator($di) as $filename => $file) {
        //echo $filename . ' - ' . $file->getSize() . ' bytes <br/>';
        $filenameshort = substr($filename, (strlen($file_id)*2+6)); 
        // upload in chunks to S3
         $result = $s3->putObject([
             'Bucket' => $config['AWS_S3_BUCKET'],
             'Key'    => $files[0]["version_id"] . "/" . $files[0]["file_name"] . $filenameshort,
             'Body'   => file_get_contents($filename),
             'ACL'    => 'public-read',
             'ContentType' => 'application/octet-stream; charset=utf-8',
             'ContentDisposition' => 'attachment; filename='. $files[0]["file_name"] . $filenameshort
         ]);
    }

    // delete files
    exec("rm -rf /tmp/".$file_id."/*");

  // if coded is not lossy, transcode
  if ((strpos($codec_name, 'pcm') !== false) || (strpos($codec_name, 'lac') !== false) || (strpos($codec_name, 'wavpack') !== false)) {
    // now we split up the song in 10sec fragments
    // now let's convert the file
    $ffmpeg = FFMpeg\FFMpeg::create(array(
        'ffmpeg.binaries'  => $config['FFMPEG_PATH'].'/ffmpeg',
        'ffprobe.binaries' => $config['FFMPEG_PATH'].'/ffprobe',
        'timeout'          => 8000, // The timeout for the underlying process
        'ffmpeg.threads'   => 12,   // The number of threads that FFMpeg should use
    ));
    $audio = $ffmpeg->open("/tmp/orig".$file_id.".".$ext);

    $format = new FFMpeg\Format\Audio\Mp3();
    $format
        ->setAudioChannels(2)
        ->setAudioKiloBitrate(192);

    $audio->save($format, "/tmp/mp3".$file_id.".mp3");

      // upload in chunks to S3
       $result = $s3->putObject([
           'Bucket' => $config['AWS_S3_BUCKET'],
           'Key'    => $files[0]["version_id"] . "/" . $files[0]["file_name"] . '.mp3',
           'Body'   => file_get_contents("/tmp/mp3".$file_id.".mp3"),
           'ACL'    => 'public-read',
           'ContentType' => 'application/octet-stream; charset=utf-8',
           'ContentDisposition' => 'attachment; filename='. $files[0]["file_name"] . '.mp3'
       ]);

     // delete file again
     unlink("/tmp/mp3".$file_id.".mp3");
  } else {
         $result = $s3->putObject([
             'Bucket' => $config['AWS_S3_BUCKET'],
             'Key'    => $files[0]["version_id"] . "/" . $files[0]["file_name"] . '.' . $ext,
             'Body'   => file_get_contents("/tmp/orig".$file_id.".".$ext),
             'ACL'    => 'public-read',
             'ContentType' => 'application/octet-stream; charset=utf-8',
             'ContentDisposition' => 'attachment; filename='. $files[0]["file_name"] . '.' . $ext
         ]);
  }
  
  // now it's time to create the png
  // let's create wave_png
  exec($config['FFMPEG_PATH']."/ffmpeg -nostats -i /tmp/orig".$file_id.".".$ext." -af astats=length=0.1:metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level -f null - 2>&1", $output);
  foreach ($output as &$value) {
    if (strpos($value, 'lavfi.astats.Overall.RMS_level=') !== false) {
        $momentarylufs = substr($value, strpos($value, "lavfi.astats.Overall.RMS_level=") + 31, 10);
        if (strpos($momentarylufs, 'inf') == false) { 
          $zerotohundred = (floatval($momentarylufs)/70)+1;
          if ($zerotohundred < 0) {
            $zerotohundred = 0;
          }
        } else {
          $zerotohundred = 0;
        }
        $wave_png[] = $zerotohundred;
      }
    }
  $wave_png_json = json_encode($wave_png);

  // Update wave_png in dB
  $version_id = $files[0]["version_id"];
  $sql = "UPDATE Version SET wave_png = '$wave_png_json' WHERE version_id = '$version_id'";
  $result = $db->query($sql);

  // Update duration in dB
  $sql = "UPDATE Version SET track_length = '$duration' WHERE version_id = '$version_id'";
  $result = $db->query($sql);

  // now if downloadable, also save the original file:
  if ($download_id > 0) {
    $sql = "SELECT version_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE file_id = '$download_id'";
    $result = $db->query($sql);
    $filesnew = $result->fetchAll();
    
    $result = $s3->putObject([
        'Bucket' => $config['AWS_S3_BUCKET'],
        'Key'    => $filesnew[0]["version_id"] . "/" . $filesnew[0]["file_name"] . '.' . $filesnew[0]["extension"],
        'Body'   => file_get_contents("/tmp/orig".$file_id.".".$ext),
        'ACL'    => 'public-read',
        'ContentType' => 'application/octet-stream; charset=utf-8',
        'ContentDisposition' => 'attachment; filename='. $files[0]["file_name"] . '.' . $filesnew[0]["extension"]
    ]);
  }

  // delete original upload
  unlink("/tmp/orig".$file_id.".".$ext);

} else {
  // return not allowed
  Flight::json(array(
     'return' => 'notallowed'
  ), 405);
} 
});












/*
ADS
*/
/////////////////////////////////////////////////////////// Routes - /ad GET //////////////////////////////////////////////////////////
Flight::route('GET /sma', function() {

$config = Flight::get("config");
// TODO: if nothing returns, show default one, no error
$db = Flight::db();
$sql = "SELECT html, ad_id, impressions FROM Ad WHERE priority = '1' AND impressions <= limits";
$result = $db->query($sql);
$array = $result->fetchAll();

$rand = rand(0,(count($array)-1));
$html = $array[$rand]["html"];
$ad_id = $array[$rand]["ad_id"];
$impressions = $array[$rand]["impressions"]+1;

// return ok
Flight::json(array(
   'ad_id' => $ad_id,
   'html' => $html
), 200);

// // store impression for new ad
// $sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);
});

/////////////////////////////////////////////////////// Routes - /ad/@ad_id GET ///////////////////////////////////////////////////////
Flight::route('GET /sma/@ad_id', function($ad_id) {

$config = Flight::get("config");
$db = Flight::db();
$sql = "SELECT html FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$html = $result->fetch()[0];

echo stripslashes($html);
});

////////////////////////////////////////////////////////// Routes - /ad POST //////////////////////////////////////////////////////////
Flight::route('POST /sma', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$ad_id = $getbody->ad_id;
$exposure_time = $getbody->exposure_time;
$clicks = $getbody->clicks;

$db = Flight::db();
$sql = "SELECT clicks, exposure_time FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$resultfetch = $result->fetchAll(PDO::FETCH_ASSOC);

$clicksnew = intval($resultfetch[0]["clicks"]) + intval($clicks);
$exposure_timenew = intval($resultfetch[0]["exposure_time"]) + intval($exposure_time);

$sql = "UPDATE Ad SET exposure_time = '$exposure_timenew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$sql = "UPDATE Ad SET clicks = '$clicksnew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);

// get next ad
$sql = "SELECT html, ad_id, impressions FROM Ad WHERE priority = '0' AND impressions <= limits AND ad_id <> '$ad_id'";
$result = $db->query($sql);
$array = $result->fetchAll(PDO::FETCH_ASSOC);

$rand = rand(0,(count($array)-1));
$html = $array[$rand]["html"];
$ad_id = $array[$rand]["ad_id"];
$impressions = $array[$rand]["impressions"]+1;

// return ok
Flight::json(array(
   'ad_id' => $ad_id
), 200);

// store impression for new ad
$sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
});


////////////////////////////////////////////////////////// Routes - /sma/imp POST //////////////////////////////////////////////////////////
Flight::route('POST /sma/imp', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$ad_id = $getbody->ad_id;

$db = Flight::db();
$sql = "SELECT clicks, exposure_time, impressions FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$resultfetch = $result->fetchAll(PDO::FETCH_ASSOC);

$impressionsnew = intval($resultfetch[0]["impressions"]) + 1;

$sql = "UPDATE Ad SET impressions = '$impressionsnew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'ok' => 'ok'
), 200);
});

////////////////////////////////////////////////////////// Routes - /sma/imp POST //////////////////////////////////////////////////////////
Flight::route('POST /sma/click', function() {

$config = Flight::get("config");
$getbody = json_decode(Flight::request()->getBody());

$ad_id = $getbody->ad_id;

$db = Flight::db();
$sql = "SELECT clicks, exposure_time, impressions FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$resultfetch = $result->fetchAll(PDO::FETCH_ASSOC);

$clicksnew = intval($resultfetch[0]["clicks"]) + 1;

$sql = "UPDATE Ad SET clicks = '$clicksnew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'ok' => 'ok'
), 200);
});


////////////////////////////////////////////////////// Routes - /unsubscribe GET //////////////////////////////////////////////////////
Flight::route('GET /unsubscribe/@update_id/@project_id', function($update_id, $project_id) {

// Check if user is allowed to get that info
$config = Flight::get("config");
$db = Flight::db();
$sql = "DELETE FROM DailyUpdates WHERE update_id = '$update_id' AND project_id = '$project_id'";
$result = $db->query($sql);

// Render a display -> front end
echo "<script>window.location = \"https://more.soundmarker.com/notifications/\";</script>";
});






/*
FLIGHT
*/
///////////////////////////////////////////////////////////// Start Flight ////////////////////////////////////////////////////////////
Flight::start();
