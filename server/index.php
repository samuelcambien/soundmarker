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

///////////////////////////////////////////////////////////// Setup SES client ////////////////////////////////////////////////////////
use Aws\Ses\SesClient;

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


Flight::route('GET /login', function() {

$config = Flight::get("config");
echo "<script>window.location = \"" . $config['OAUTH_SERVER_LOCATION'] . "/oauth/authorize/?response_type=code&client_id=" . $config['OAUTH_CLIENT_ID'] . "&state=soundmarkerpro&redirect_uri=" . $config['PHPSERVER_URL'] ."callback.php" . "\";</script>";
});











/*
PROJECT
*/
//////////////////////////////////////////////////////// Routes - /project/new POST ///////////////////////////////////////////////////
Flight::route('POST /project/new', function() {

  Flight::get("config");
// Todo: check if user_id exists first (foreign_key needs to be valid) -> put in dB
  $getbody = json_decode(Flight::request()->getBody());

  $user_id = isset($_SESSION['USER']) ? $_SESSION['USER'] : "0";
  $project_title = isset($getbody->project_title) ? $getbody->project_title : "";
  $project_password = isset($getbody->project_password) ? $getbody->project_password : "";
  $ipaddr = $_SERVER['REMOTE_ADDR'] . " - " . $_SERVER['HTTP_X_FORWARDED_FOR'];

  $db = Flight::db();
  $db->query("INSERT INTO Project (user_id, title, password, active, ipaddr) VALUES ('$user_id', '$project_title', '$project_password', '1', '$ipaddr')");
  $project_id = $db->lastInsertId();

  $uuid = UUID::v4() . UUID::v4();
  $db->query("UPDATE Project SET hash = '$uuid' WHERE project_id = '$project_id'");

// return ok
  Flight::json(array(
    'project_id' => $project_id
  ));
});

//////////////////////////////////////////////////////// Routes - /project/edit POST ///////////////////////////////////////////////////
Flight::route('POST /project/edit', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $project_id = isset($getbody->project_id) ? $getbody->project_id : "";
  $project_title = isset($getbody->project_title) ? $getbody->project_title : "";
  $project_password = isset($getbody->project_password) ? $getbody->project_password : "";

  $db = Flight::db();
  $db->query("UPDATE Project SET title = '$project_title' WHERE project_id = '$project_id'");
  $db->query("UPDATE Project SET password = '$project_password' WHERE project_id = '$project_id'");

  // return ok
  Flight::json(array(
    'return' => 'ok'
  ));
});

//////////////////////////////////////////////////////// Routes - /project/all GET ///////////////////////////////////////////////////
Flight::route('GET /project/all', function() {

  Flight::get("config");

  $user_id = isset($_SESSION['USER']) ? $_SESSION['USER'] : "0";
  if (isset($_SESSION['USER'])) {
    $result = Flight::db()
      ->query("SELECT project_id, title, expiration_date, hash FROM Project WHERE user_id = '$user_id' AND active = '1'")
      ->fetchAll(PDO::FETCH_ASSOC);

    Flight::json(array(
      'projects' => $result
    ));
  } else {
    Flight::json(array(
      'return' => 'notloggedin'
    ));
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

  $db = Flight::db();
  // Update expiration date
  $projectdate = new \DateTime('+' . $expiration);
  $projectdatef = $projectdate->format('Y-m-d H:i:s');
  $db->query("UPDATE Project SET expiration_date = '$projectdatef' WHERE project_id = '$project_id'");

  $hash = $db->query("SELECT hash FROM Project WHERE project_id = '$project_id'")->fetch()[0];

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
  $emailstring = str_replace("%projectdate%", $projectdate->format('F jS Y'), $emailstring);
  $emailstring_text = str_replace("%projectdate%", $projectdate->format('F jS Y'), $emailstring_text);
  // Replace strings -> %projectlink%
  $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
  $projectlink = $config['SERVER_URL'] . "/project/" . $db->query($sql)->fetch()[0];
  $emailstring = str_replace("%projectlink%", $projectlink, $emailstring);
  $emailstring_text = str_replace("%projectlink%", $projectlink, $emailstring_text);
  // Replace strings -> %recipientmail%
  if ($receiver) {
    $emailstring = str_replace("%recipientmail%", implode("<br>", $receiver), $emailstring);
    $emailstring_text = str_replace("%recipientmail%", implode("\n", $receiver), $emailstring_text);
  } else {
    $emailstring = str_replace("%recipientmail%", "Link only", $emailstring);
    $emailstring_text = str_replace("%recipientmail%", "Link only", $emailstring_text);
  }
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
    $trackcount = count($files) . " track";
  } else {
    $trackcount = count($files) . " tracks";
  }
  $emailstring = str_replace("%trackamount%", $trackcount, $emailstring);
  $emailstring_text = str_replace("%trackamount%", $trackcount, $emailstring_text);
  // Replace strings -> %tracktitle%
  $tracktitle = "";
  foreach ($files as &$file) {
    $tracktitle .= urldecode($file["file_name"]) . "<br>";
  }
  $emailstring = str_replace("%tracktitle%", $tracktitle, $emailstring);
  $emailstring_text = str_replace("%tracktitle%", $tracktitle, $emailstring_text);

  $subject = 'Your tracks have been shared successfully via Soundmarker';
  $char_set = 'UTF-8';

  mail($sender, $subject, $emailstring);

  // only send if opted in for email
  if ($receiver) {
    // Send Email to Recipient
    $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
    $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
    $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');

    // Replace strings
    // Replace strings -> %projectdate%
    $emailstring = str_replace("%projectdate%", $projectdate->format('F jS Y'), $emailstring);
    $emailstring_text = str_replace("%projectdate%", $projectdate->format('F jS Y'), $emailstring_text);
    // Replace strings -> %projectlink%
    $emailstring = str_replace("%projectlink%", $projectlink, $emailstring);
    $emailstring_text = str_replace("%projectlink%", $projectlink, $emailstring_text);
    // Replace strings -> %recipientmail%
    $emailstring = str_replace("%recipientmail%", implode("\n", $receiver), $emailstring);
    $emailstring_text = str_replace("%recipientmail%", implode("\n", $receiver), $emailstring_text);
    // Replace strings -> %trackamount%
    $emailstring = str_replace("%trackamount%", $trackcount, $emailstring);
    $emailstring_text = str_replace("%trackamount%", $trackcount, $emailstring_text);
    // Replace strings -> %tracktitle%
    $emailstring = str_replace("%tracktitle%", $tracktitle, $emailstring);
    $emailstring_text = str_replace("%tracktitle%", $tracktitle, $emailstring_text);
    // Replace strings -> %projectnotes%
    $emailstring = str_replace("%projectnotes%", urldecode($notes), $emailstring);
    $emailstring_text = str_replace("%projectnotes%", urldecode($notes), $emailstring_text);
    // Replace strings -> %sendermail%
    $emailstring = str_replace("%sendermail%", $sender, $emailstring);
    $emailstring_text = str_replace("%sendermail%", $sender, $emailstring_text);

    $subject = $sender . ' has shared ' . $trackcount . ' with you via Soundmarker';
    $char_set = 'UTF-8';

    foreach ($receiver as $receiveremail) {
      mail($receiveremail, $subject, $emailstring,
        'From:Soundmarker <noreply@soundmarker.com>' . '\r\n' .
        'Reply-To:' . $sender
      );

      // Create DailyUpdates in dB
      $db->query("INSERT INTO DailyUpdates (emailaddress, project_id) VALUES ('$sender', '$project_id')");
    }
  }

  // Create notifications
  // Notification -> Expired
  $senddate = $projectdate->modify('-3 days');
  $senddatef = $senddate->format('Y-m-d H:i:s');
  if ($receiver) {
    $receiverstring = implode("\n", $receiver);
  } else {
    $receiverstring = "";
  }
  Flight::db()->query(
    "INSERT INTO Notification (emailaddress, senddate, type, status, type_id, recipientemail) VALUES ('$sender', '$projectdatef', '0', '0', '$project_id', '$receiverstring')"
  );

  Flight::json(array(
    'project_hash' => $hash
  ));
});

/////////////////////////////////////////////////////// Routes - /project/subscribe GET ///////////////////////////////////////////////////////

Flight::route('POST /project/subscribe', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $emailaddress = $getbody->emailaddress;
  $project_id = $getbody->project_id;
  $notify_id = $getbody->notify_id;

  $db = Flight::db();

// Check to make sure it doesn't exist yet.
  $response = $db
    ->query("SELECT emailaddress FROM DailyUpdates WHERE project_id = '$project_id' AND emailaddress = '$emailaddress'")
    ->fetchAll(PDO::FETCH_ASSOC);
  if (!isset($response[0])) {
    $db->query("INSERT INTO DailyUpdates (project_id, emailaddress, notify_id) VALUES ('$project_id', '$emailaddress', '$notify_id')");
    Flight::json(array(
      'return' => "ok"
    ));
  } else {
    // return alreadyindatabase
    Flight::json(array(
      'return' => "alreadyindatabase"
    ));
  }
});


//////////////////////////////////////////////// Routes - /project/get/@project_hash GET /////////////////////////////////////////////
Flight::route('GET /project/get/@project_hash', function($project_hash) {

  Flight::get("config");
  $response = Flight::db()->query("SELECT project_id, active, expiration_date, user_id, password FROM Project WHERE hash = '$project_hash'")->fetchAll(PDO::FETCH_ASSOC);

// check if project hash was valid
  if ($response) {
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

    $tracks = Flight::db()->query("SELECT track_id, title FROM Track WHERE project_id = '$project_id'")->fetchAll(PDO::FETCH_ASSOC);
    if ($status == "expired") {
      $tracks = "";
    }

    // if project is password protected
    if ($project_password) {
      // return ok
      Flight::json(array(
        'project_id' => $project_id, 'status' => $status, 'tracks' => $tracks
      ));
    } else {
      // also send sender
      $sql = "SELECT emailaddress, user_id FROM Notification WHERE type = '0' AND type_id = '$project_id'";
      $response = Flight::db()->query($sql)->fetchAll(PDO::FETCH_ASSOC);
      // if only link is created, then no sender
      if (isset($response[0])) {
        $emailaddress = $response[0]["emailaddress"];
      } else {
        $emailaddress = "";
      }

      // return ok
      Flight::json(array(
        'project_id' => $project_id, 'status' => $status, 'expiration' => $expiration_date, 'sender' => $emailaddress, 'tracks' => $tracks
      ));
    }
  } else {
    // project hash was not valid.
    Flight::json(array(
      'return' => 'nook'
    ));
  }
});

//////////////////////////////////////////////// Routes - /project/set/viewpassword POST /////////////////////////////////////////////
Flight::route('POST /project/set/viewpassword', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());
  $project_id = $getbody->project_id;
  $project_password = $getbody->password;

  $result = Flight::db()->query("SELECT password FROM Project WHERE project_id = '$project_id'");

  if ($result->fetch()[0] == $project_password) {
    Flight::json(array(
      'return' => 'ok'
    ));
  } else {
    Flight::json(array(
      'return' => 'nook'
    ));
  }
});

///////////////////////////////////////////////////// Routes - /project/password POST /////////////////////////////////////////////////
Flight::route('POST /project/password', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());
  $project_id = $getbody->project_id;

  $result = Flight::db()->query("SELECT password FROM Project WHERE project_id = '$project_id'");

  Flight::json(array(
    'project_id' => $project_id,
    'project_password' => $result->fetch()[0]
  ));
});

//////////////////////////////////////////////////// Routes - /project/delete POST ////////////////////////////////////////////////////
Flight::route('POST /project/delete', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());
  $project_id = $getbody->project_id;

  Flight::db()->query("UPDATE Project SET active = '0' WHERE project_id = '$project_id'");

  Flight::json(array(
    'project_id' => $project_id
  ));
});

//////////////////////////////////////////////////// Routes - /project/url POST ///////////////////////////////////////////////////////
Flight::route('POST /project/url', function() {

  $config = Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());
  $project_id = $getbody->project_id;

  $db = Flight::db();
  $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
  $result = $db->query($sql);

  Flight::json(array(
    'project_url' => $config['SERVER_URL'] . '/project/' . $result->fetch()[0],
    'project_hash' => $result->fetch()[0]
  ));
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

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $project_id = $getbody->project_id;
  $track_title = isset($getbody->track_title) ? $getbody->track_title : "";
  $track_artist = isset($getbody->track_artist) ? $getbody->track_artist : "";
  $visibility = isset($getbody->visibility) ? $getbody->visibility : 1;

  if ($project_id) {
    $sql = "INSERT INTO Track (title, artist, project_id, visibility) VALUES ('$track_title', '$track_artist', '$project_id', '$visibility')";
  } else {
    $sql = "INSERT INTO Track (title, artist, visibility) VALUES ('$track_title', '$track_artist', '$visibility')";
  }
  Flight::db()->query($sql);

  Flight::json(array(
    'track_id' => Flight::db()->lastInsertId()
  ));
});

/////////////////////////////////////////////////////// Routes - /track/visibility POST //////////////////////////////////////////////////////
Flight::route('POST /track/visibility', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $track_id = $getbody->track_id;
  $visibility = isset($getbody->visibility) ? $getbody->visibility : 1;

  Flight::db()->query("UPDATE Track SET visibility = '$visibility' WHERE track_id = '$track_id'");

  Flight::json(array(
    'return' => 'ok'
  ));
});

//////////////////////////////////////////////////// Routes - /track/version POST /////////////////////////////////////////////////////
Flight::route('POST /track/version', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $track_id = $getbody->track_id;
  $downloadable = isset($getbody->downloadable) ? $getbody->downloadable : 0;
  $visibility = isset($getbody->visibility) ? $getbody->visibility : 1;
  $notes = isset($getbody->notes) ? $getbody->notes : "";
  $version_title = isset($getbody->version_title) ? $getbody->version_title : "";
  $track_length = isset($getbody->track_length) ? $getbody->track_length : 0;

  Flight::db()->query("INSERT INTO Version (track_id, downloadable, visibility, notes, version_title, track_length) VALUES ('$track_id', '$downloadable', '$visibility', '$notes', '$version_title', '$track_length')");

  Flight::json(array(
    'version_id' => Flight::db()->lastInsertId()
  ));
});


//////////////////////////////////////////////////// Routes - /track/version/edit POST /////////////////////////////////////////////////////
Flight::route('POST /track/version/edit', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $version_id = isset($getbody->version_id) ? $getbody->version_id : "";
  $downloadable = isset($getbody->downloadable) ? $getbody->downloadable : 0;
  $visibility = isset($getbody->visibility) ? $getbody->visibility : 1;
  $notes = isset($getbody->notes) ? $getbody->notes : "";
  $version_title = isset($getbody->version_title) ? $getbody->version_title : "";

  Flight::db()->query("UPDATE Version SET notes = '$notes', version_title = '$version_title', visibility = '$visibility', downloadable = '$downloadable' WHERE version_id = '$version_id'");

  Flight::json(array(
    'version_id' => Flight::db()->lastInsertId()
  ));

});

///////////////////////////////////////////////////////// Routes - /track GET /////////////////////////////////////////////////////////
Flight::route('GET /track/@track_id', function($track_id) {
  Flight::get("config");

  $versions = Flight::db()
    ->query("SELECT version_id, notes, downloadable, visibility, version_title, track_length, wave_png FROM Version WHERE track_id = '$track_id'")
    ->fetchAll(PDO::FETCH_ASSOC);

  foreach ($versions as &$version) {
    $version["wave_png"] = file_get_contents('waveform/' . $version["version_id"]);
  }

  Flight::json(array(
    'versions' => $versions
  ));
});

///////////////////////////////////////////////////// Routes - /track/version GET /////////////////////////////////////////////////////
Flight::route('GET /track/version/@version_id', function($version_id) {
  Flight::get("config");

  $files = Flight::db()
    ->query("SELECT file_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE version_id = '$version_id'")
    ->fetchAll(PDO::FETCH_ASSOC);

  Flight::json(array(
    'files' => $files
  ));
});

///////////////////////////////////////////////// Routes - /track/version/comments GET ////////////////////////////////////////////////
Flight::route('GET /track/version/comments/@version_id', function($version_id) {
  Flight::get("config");

  $comments = Flight::db()
    ->query("SELECT comment_id, notes, start_time, end_time, checked, parent_comment_id, name, include_end, include_start, comment_time FROM Comment WHERE version_id = '$version_id'")
    ->fetchAll(PDO::FETCH_ASSOC);

  // don't cache
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Pragma: no-cache");

  // return ok
  Flight::json(array(
    'comments' => $comments
  ));
});

///////////////////////////////////////////////// Routes - /track/version/comment POST ////////////////////////////////////////////////
Flight::route('POST /track/version/comment', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $version_id = $getbody->version_id;
  $notes = isset($getbody->notes) ? $getbody->notes : "";
  $name = isset($getbody->name) ? $getbody->name : "";
  $start_time = isset($getbody->start_time) ? $getbody->start_time : 0;
  $end_time = isset($getbody->end_time) ? $getbody->end_time : 0;
  $parent_comment_id = isset($getbody->parent_comment_id) ? $getbody->parent_comment_id : 0;
  $include_start = isset($getbody->include_start) ? $getbody->include_start : 0;
  $include_end = isset($getbody->include_end) ? $getbody->include_end : 0;
  $comment_time = isset($getbody->comment_time) ? $getbody->comment_time : "";

  Flight::db()
    ->query("INSERT INTO Comment (version_id, notes, name, start_time, end_time, parent_comment_id, include_start, include_end, comment_time) VALUES ('$version_id', '$notes', '$name', '$start_time', '$end_time', '$parent_comment_id', '$include_start', '$include_end', '$comment_time')");

  // return ok
  Flight::json(array(
    'comment_id' => Flight::db()->lastInsertId()
  ));
});

///////////////////////////////////////////////// Routes - /track/version/delete/comment POST ///////////////////////////////////////////
Flight::route('POST /track/version/delete/comment', function() {

  Flight::get("config");
  $comment_id = json_decode(Flight::request()->getBody())->comment_id;

  Flight::db()->query("DELETE FROM Comment WHERE comment_id = '$comment_id'");

  Flight::json(array(
    'return' => 'ok'
  ));
});


////////////////////////////////////////////////// Routes - /track/file/download GET //////////////////////////////////////////////////
Flight::route('GET /track/file/download/@file_id', function($file_id) {
  Flight::get("config");
  $aws_path = Flight::db()->query("SELECT aws_path  FROM File WHERE file_id = '$file_id'")->fetch()[0];
  // return ok
  Flight::json(array(
    'aws_path' => $aws_path
  ));
});








/*
FILE
*/
/////////////////////////////////////////////////////// Routes - /file/new POST ///////////////////////////////////////////////////////
Flight::route('POST /file/new', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $version_id = $getbody->version_id;
  $identifier = isset($getbody->identifier) ? $getbody->identifier : 0;
  $chunk_length = isset($getbody->chunk_length) ? $getbody->chunk_length : 0;
  $file_size = isset($getbody->file_size) ? $getbody->file_size : 0;
  $file_name = isset($getbody->file_name) ? $getbody->file_name : "";
  $metadata = isset($getbody->metadata) ? $getbody->metadata : "";
  $extension = isset($getbody->extension) ? $getbody->extension : "";

  $db = Flight::db();
  $db->query("INSERT INTO File (version_id, file_name, file_size, metadata, extension, chunk_length, identifier) VALUES ('$version_id', '$file_name', '$file_size', '$metadata', '$extension', '$chunk_length', '$identifier')");

  $file_id = $db->lastInsertId();
  $aws_path = "\/audio\/orig" . $file_id;
  $db->query("UPDATE File set aws_path = '$aws_path' where version_id = '$version_id'");
  Flight::json(array(
    'file_id' => $file_id
  ));
});

////////////////////////////////////////////////// Routes - /file/chunk/$file_id POST /////////////////////////////////////////////////
Flight::route('POST /file/chunk/@file_id/@download_id/@idno/@ext', function($file_id, $download_id, $idno, $ext) {

  $config = Flight::get("config");
  ignore_user_abort(true);
  set_time_limit(0);

  $version_id = Flight::db()
    ->query("SELECT version_id, extension, metadata, file_name, file_size, identifier, chunk_length FROM File WHERE file_id = '$file_id'")
    ->fetchAll()[0]["version_id"];

  // store audio file.
  // $myfile = fopen("audio/orig".$file_id.".".$ext, "w") or die("Unable to open file!");
  // fwrite($myfile, Flight::request()->getBody());
  // fclose($myfile);
  $source = fopen("php://input", "r") or die("Unable to open file!");
  $dest = fopen("audio/orig" . $file_id . "." . $ext, "w") or die("Unable to open file!");

  while (!feof($source)) {
    fwrite($dest, fgets($source));
  }

  fclose($dest);

  // close session
  session_write_close();

  // return ok -> let's try
  Flight::json(array(
    'ok' => 'ok'
  ), 200);

  // now let's see how long the song is
  $ffprobe = FFMpeg\FFProbe::create(array(
    'ffmpeg.binaries' => $config['FFMPEG_PATH'] . '/ffmpeg',
    'ffprobe.binaries' => $config['FFMPEG_PATH'] . '/ffprobe',
    'timeout' => 8000, // The timeout for the underlying process
    'ffmpeg.threads' => 12,   // The number of threads that FFMpeg should use
  ));
  $duration = $ffprobe
    ->format("audio/orig" . $file_id . "." . $ext) // extracts file informations
    ->get('duration');

  $codec_name = $ffprobe
    ->streams("audio/orig" . $file_id . "." . $ext) // extracts file informations
    ->first()
    ->get('codec_name');

  // mkdir folder
  exec("mkdir audio/" . $file_id);

  // now create segments
  exec($config['FFMPEG_PATH'] . "/ffmpeg -i audio/orig" . $file_id . "." . $ext . " -segment_time 10 -codec:a libmp3lame -qscale:a 1 audio/" . $file_id . "/" . $file_id . "%03d.mp3");

  // Update duration in dB
  Flight::db()->query("UPDATE Version SET track_length = '$duration' WHERE version_id = '$version_id'");

  // if coded is not lossy, transcode
  // if ((strpos($codec_name, 'pcm') !== false) || (strpos($codec_name, 'lac') !== false) || (strpos($codec_name, 'wavpack') !== false)) {
  // now we split up the song in 10sec fragments
  // now let's convert the file
  $ffmpeg = FFMpeg\FFMpeg::create(array(
    'ffmpeg.binaries' => $config['FFMPEG_PATH'] . '/ffmpeg',
    'ffprobe.binaries' => $config['FFMPEG_PATH'] . '/ffprobe',
    'timeout' => 8000, // The timeout for the underlying process
    'ffmpeg.threads' => 12,   // The number of threads that FFMpeg should use
  ));
  $audio = $ffmpeg->open("audio/orig" . $file_id . "." . $ext);

  $format = new FFMpeg\Format\Audio\Mp3();
  $format
    ->setAudioChannels(2)
    ->setAudioKiloBitrate(320);

  $audio->save($format, "/tmp/mp3" . $file_id . ".mp3");

  gc_collect_cycles();
  // now it's time to create the png
  // let's create wave_png
  exec($config['FFMPEG_PATH'] . "/ffmpeg -nostats -i audio/orig" . $file_id . "." . $ext . " -af astats=length=0.1:metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level -f null - 2>&1", $output);
  foreach ($output as $value) {
    if (strpos($value, 'lavfi.astats.Overall.RMS_level=') !== false) {
      $momentarylufs = substr($value, strpos($value, "lavfi.astats.Overall.RMS_level=") + 31, 10);
      if (strpos($momentarylufs, 'inf') == false) {
        $zerotohundred = (floatval($momentarylufs) / 70) + 1;
        if ($zerotohundred < 0) {
          $zerotohundred = 0;
        }
      } else {
        $zerotohundred = 0;
      }
      $wave_png[] = $zerotohundred;
    }
  }
  file_put_contents('waveform/' . $version_id, json_encode($wave_png));

  // now if downloadable, also save the original file:
  if ($download_id > 0) {
    // $sql = "SELECT version_id, extension, metadata, file_name, file_size, identifier, chunk_length FROM File WHERE file_id = '$download_id'";
    // $result = $db->query($sql);
    // $filesnew = $result->fetchAll();
  }

  gc_collect_cycles();
});












/*
ADS
*/
/////////////////////////////////////////////////////////// Routes - /ad GET //////////////////////////////////////////////////////////
// retire this call
Flight::route('GET /sma', function() {

  Flight::get("config");
  // TODO: if nothing returns, show default one, no error
  $array = Flight::db()
    ->query("SELECT html, ad_id, impressions FROM Ad WHERE priority = '1' AND impressions <= limits")
    ->fetchAll();

  $rand = rand(0, (count($array) - 1));
  $html = $array[$rand]["html"];
  $ad_id = $array[$rand]["ad_id"];

  Flight::json(array(
    'sma_id' => $ad_id,
    'html' => $html
  ));

// // store impression for new ad
//  $db->query("UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id'");
});

/////////////////////////////////////////////////////// Routes - /ad/@ad_id GET ///////////////////////////////////////////////////////
Flight::route('GET /sma/@ad_id', function($ad_id) {
  Flight::get("config");

  $html = Flight::db()->query("SELECT html FROM Ad WHERE ad_id = '$ad_id'")->fetch()[0];
  echo stripslashes($html);
});

////////////////////////////////////////////////////////// Routes - /ad POST //////////////////////////////////////////////////////////
Flight::route('POST /sma', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $ad_id = $getbody->sma_id;

  // get next ad
  $db = Flight::db();
  $array = $db
    ->query("SELECT html, ad_id, impressions FROM Ad WHERE priority = '0' AND impressions <= limits AND ad_id <> '$ad_id'")
    ->fetchAll(PDO::FETCH_ASSOC);

  $rand = rand(0, (count($array) - 1));
  $html = $array[$rand]["html"];
  $ad_id = $array[$rand]["ad_id"];

  Flight::json(array(
    'sma_id' => $ad_id,
    'html' => $html
  ));
});

////////////////////////////////////////////////////////// Routes - /sma/imp POST //////////////////////////////////////////////////////////
Flight::route('POST /sma/imp', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $ad_id = $getbody->sma_id;

  $db = Flight::db();
  $resultfetch = $db
    ->query("SELECT clicks, exposure_time, impressions FROM Ad WHERE ad_id = '$ad_id'")
    ->fetchAll(PDO::FETCH_ASSOC);

  $impressionsnew = intval($resultfetch[0]["impressions"]) + 1;

  $db->query("UPDATE Ad SET impressions = '$impressionsnew' WHERE ad_id = '$ad_id'");

  Flight::json(array(
    'ok' => 'ok'
  ));
});

////////////////////////////////////////////////////////// Routes - /sma/imp POST //////////////////////////////////////////////////////////
Flight::route('POST /sma/click', function() {

  Flight::get("config");
  $getbody = json_decode(Flight::request()->getBody());

  $ad_id = $getbody->sma_id;

  $db = Flight::db();
  $sql = "SELECT clicks, exposure_time, impressions FROM Ad WHERE ad_id = '$ad_id'";
  $result = $db->query($sql);
  $resultfetch = $result->fetchAll(PDO::FETCH_ASSOC);

  $clicksnew = intval($resultfetch[0]["clicks"]) + 1;

  $db->query("UPDATE Ad SET clicks = '$clicksnew' WHERE ad_id = '$ad_id'");

// return ok
  Flight::json(array(
    'ok' => 'ok'
  ));
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
