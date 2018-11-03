<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';

/*
GLOBALE DECLARATIONS
*/
///////////////////////////////////////////////////////////////// Unique ID ///////////////////////////////////////////////////////////
//  class UUID {
//   public static function v4() {
//     return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

//       // 32 bits for "time_low"
//       mt_rand(0, 0xffff), mt_rand(0, 0xffff),

//       // 16 bits for "time_mid"
//       mt_rand(0, 0xffff),

//       // 16 bits for "time_hi_and_version",
//       // four most significant bits holds version number 4
//       mt_rand(0, 0x0fff) | 0x4000,

//       // 16 bits, 8 bits for "clk_seq_hi_res",
//       // 8 bits for "clk_seq_low",
//       // two most significant bits holds zero and one for variant DCE1.1
//       mt_rand(0, 0x3fff) | 0x8000,

//       // 48 bits for "node"
//       mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
//     );
//   }
// }

///////////////////////////////////////////////////////////////// Setup DB ////////////////////////////////////////////////////////////
// Flight::register('db', 'PDO', array('mysql:host='.$_SERVER["RDS_HOSTNAME"].';dbname='.$_SERVER["RDS_DB_NAME"], $_SERVER["RDS_USERNAME"], $_SERVER["RDS_PASSWORD"]), function($db) {
//         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// });

$dbh = new PDO('mysql:host='.$_SERVER["RDS_HOSTNAME"].';dbname='.$_SERVER["RDS_DB_NAME"], $_SERVER["RDS_USERNAME"], $_SERVER["RDS_PASSWORD"]);

////////////////////////////////////////////////////////////// Setup S3 client ////////////////////////////////////////////////////////
// use Aws\S3\S3Client;
// use Aws\S3\Exception\S3Exception;

// $credentials = new Aws\Credentials\Credentials("AKIAJ2I2I4CLJHCP3NPQ", "H31YdXr6TwoC8lRCSrFhA4n5JXZsiBIuqezP9P+b");
// $s3bucket = 'soundmarkersass-local-robin';

// $s3 = new Aws\S3\S3Client([
//     'version'     => 'latest',
//     'region'      => 'eu-west-1',
//     'credentials' => $credentials
// ]);

// Flight::set("s3", $s3);
// Flight::set("s3bucket", $s3bucket);

///////////////////////////////////////////////////////////// Setup SES client ////////////////////////////////////////////////////////
use Aws\Ses\SesClient;
use Aws\Exception\AwsException;

$SesClient = new SesClient([
    'profile' => 'project1',
    'version' => '2010-12-01',
    'region'  => 'eu-west-1',
]);

// Flight::set("SesClient", $SesClient);







// /*
// ROUTING TO FRONT-END
// */
// /////////////////////////////////////////////////////////// Routes - Global Index /////////////////////////////////////////////////////
// Flight::route('/', function(){
//     include 'index.html';












// /*
// PROJECT
// */
// //////////////////////////////////////////////////////// Routes - /project/new POST ///////////////////////////////////////////////////
// Flight::route('POST /project/new', function() {

// Todo: check if user_id exists first (foreign_key needs to be valid) -> put in dB
// Add expiration date
// $user_id = isset(json_decode(Flight::request()->getBody())->user_id) ? json_decode(Flight::request()->getBody())->user_id : "";
// $project_title = isset(json_decode(Flight::request()->getBody())->project_title) ? json_decode(Flight::request()->getBody())->project_title : "";
// $project_password = isset(json_decode(Flight::request()->getBody())->project_password) ? json_decode(Flight::request()->getBody())->project_password : "";

$emailaddress = "robinreumers@gmail.com";
$senddate = new \DateTime('+7 days');
$senddatef = $senddate->format('Y-m-d H:i:s');

$sql = "INSERT INTO Notification (emailaddress, senddate) VALUES ('$emailaddress', '$senddatef')";
$result = $dbh->query($sql);
// $project_id = $db->lastInsertId();

// $uuid = UUID::v4().UUID::v4();
// $sql = "UPDATE Project SET hash = '$uuid' WHERE project_id = '$project_id'";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
// });

// //////////////////////////////////////////////// Routes - /project/get/@project_hash POST /////////////////////////////////////////////
// Flight::route('POST /project/get/url', function() {

// // set expiration date
// // calculate amount of tracks and get track names
// $project_id = isset(json_decode(Flight::request()->getBody())->project_id) ? json_decode(Flight::request()->getBody())->project_id : "";
// $sender = isset(json_decode(Flight::request()->getBody())->sender) ? json_decode(Flight::request()->getBody())->sender : "";
// $receiver = isset(json_decode(Flight::request()->getBody())->receiver) ? json_decode(Flight::request()->getBody())->receiver : "";
// $expiration = isset(json_decode(Flight::request()->getBody())->expiration) ? json_decode(Flight::request()->getBody())->expiration : "1 week";
// // check notes????
// $notes = isset(json_decode(Flight::request()->getBody())->notes) ? json_decode(Flight::request()->getBody())->notes : "";

// $db = Flight::db();
// try {
//     $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
//     $result = $db->query($sql);
//     $hash = $result->fetch()[0];

//     // https://www.functions-online.com/htmlentities.html
//     // htmlentities('', ENT_COMPAT, 'ISO-8859-1');
//     // html_entity_decode('', ENT_COMPAT, 'ISO-8859-1');
//     // Send Email to Sender
//     $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-initial-email-to-sender'";
//     $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
//     $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-initial-email-to-sender'";
//     $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    
//     // Replace strings
//     // Replace strings -> %projectdate%
//     $projectdate = new \DateTime('+'.$expiration);
//     $projectdatef = $projectdate->format('Y-m-d H:i:s');
//     $sql = "UPDATE Project SET expiration_date = '$projectdatef' WHERE project_id = '$project_id'";
//     $result = $db->query($sql);
//     $emailstring = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring);
//     $emailstring_text = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring_text);
//     // Replace strings -> %projectlink%
//     $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
//     $projectlink = "http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com/project/" . $db->query($sql)->fetch()[0];
//     $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
//     $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
//     // Replace strings -> %recipientmail%
//     $emailstring = str_replace("%recipientmail%",$receiver,$emailstring);
//     $emailstring_text = str_replace("%recipientmail%",$receiver,$emailstring_text);
//     // Replace strings -> %trackamount%
//     $sql = "SELECT track_id FROM Track WHERE project_id = '$project_id'";
//     $tracks = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
//     foreach ($tracks as &$track) {
//         $trackid = $track["track_id"];
//         $sqlversion = "SELECT version_id FROM Version WHERE track_id = '$trackid'";
//         $versions[] = $db->query($sqlversion)->fetchAll(PDO::FETCH_ASSOC);
//     }
//     foreach ($versions as &$versions2) {
//       foreach ($versions2 as &$version) {
//           $versionid = $version["version_id"];
//           $sqlfiles = "SELECT file_name FROM File WHERE version_id = '$versionid'";
//           $files[] = $db->query($sqlfiles)->fetchAll(PDO::FETCH_ASSOC)[0];
//       }
//     }
//     if (count($files) == 1) {
//       $trackcount = count($files). " track";
//     } else {
//       $trackcount = count($files). " tracks";
//     }
//     $emailstring = str_replace("%trackamount%",$trackcount,$emailstring);
//     $emailstring_text = str_replace("%trackamount%",$trackcount,$emailstring_text);   
//     // Replace strings -> %tracktitle%
//     $tracktitle = "";
//     foreach ($files as &$file) {
//         $tracktitle .= $file["file_name"] . "\n";
//     }
//     $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
//     $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   

//     $subject = 'Your tracks have been shared succesfully via Soundmarker';
//     $char_set = 'UTF-8';

//     try {
//         $result = Flight::get("SesClient")->sendEmail([
//             'Destination' => [
//                 'ToAddresses' => [$sender],
//             ],
//             'ReplyToAddresses' => ["noreply@soundmarker.com"],
//             'Source' => "Soundmarker <noreply@soundmarker.com>",
//             'Message' => [
//               'Body' => [
//                   'Html' => [
//                       'Charset' => $char_set,
//                       'Data' => $emailstring,
//                   ],
//                   'Text' => [
//                       'Charset' => $char_set,
//                       'Data' => $emailstring_text,
//                   ],
//               ],
//               'Subject' => [
//                   'Charset' => $char_set,
//                   'Data' => $subject,
//               ],
//             ],
//         ]);
//         $messageId = $result['MessageId'];
//     } catch (AwsException $e) {
//         // output error message if fails
//         echo $e->getMessage();
//         echo("The email was not sent. Error message: ".$e->getAwsErrorMessage()."\n");
//     }

//     // Send Email to Recipient
//     $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
//     $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
//     $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-initial-email-to-recipient'";
//     $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
    
//     // Replace strings
//     // Replace strings -> %projectdate%
//     $emailstring = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring);
//     $emailstring_text = str_replace("%projectdate%",$projectdate->format('F jS Y'),$emailstring_text);
//     // Replace strings -> %projectlink%
//     $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
//     $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
//     // Replace strings -> %recipientmail%
//     $emailstring = str_replace("%recipientmail%",$receiver,$emailstring);
//     $emailstring_text = str_replace("%recipientmail%",$receiver,$emailstring_text);
//     // Replace strings -> %trackamount%
//     $emailstring = str_replace("%trackamount%",$trackcount,$emailstring);
//     $emailstring_text = str_replace("%trackamount%",$trackcount,$emailstring_text);   
//     // Replace strings -> %tracktitle%
//     $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
//     $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   
//     // Replace strings -> %projectnotes%
//     $emailstring = str_replace("%projectnotes%",$notes,$emailstring);
//     $emailstring_text = str_replace("%projectnotes%",$notes,$emailstring_text);   
//     // Replace strings -> %sendermail%
//     $emailstring = str_replace("%sendermail%",$sender,$emailstring);
//     $emailstring_text = str_replace("%sendermail%",$sender,$emailstring_text);   

//     $subject = $sender . ' has shared '. $trackcount . ' with you via Soundmarker';
//     $char_set = 'UTF-8';

//     try {
//         $result = Flight::get("SesClient")->sendEmail([
//             'Destination' => [
//                 'ToAddresses' => [$receiver],
//             ],
//             'ReplyToAddresses' => [$sender],
//             'Source' => "Soundmarker <noreply@soundmarker.com>",
//             'Message' => [
//               'Body' => [
//                   'Html' => [
//                       'Charset' => $char_set,
//                       'Data' => $emailstring,
//                   ],
//                   'Text' => [
//                       'Charset' => $char_set,
//                       'Data' => $emailstring_text,
//                   ],
//               ],
//               'Subject' => [
//                   'Charset' => $char_set,
//                   'Data' => $subject,
//               ],
//             ],
//         ]);
//         $messageId = $result['MessageId'];
//     } catch (AwsException $e) {
//         // output error message if fails
//         echo $e->getMessage();
//         echo("The email was not sent. Error message: ".$e->getAwsErrorMessage()."\n");
//     }
//     // return ok
//     Flight::json(array(
//        'project_hash' => $hash
//     ), 200);

// } catch (PDOException $pdoException) {
//     Flight::error($pdoException);
// } catch (Exception $exception) {
//         Flight::error($exception);
// } finally {
//     $db = null;
// }
// });

// //////////////////////////////////////////////// Routes - /project/get/@project_hash POST /////////////////////////////////////////////
// Flight::route('GET /project/get/@project_hash', function($project_hash) {

// $db = Flight::db();
// try {
//     $sql = "SELECT project_id FROM Project WHERE hash = '$project_hash'";
//     $result = $db->query($sql);
//     $project_id = $result->fetch()[0];

//     $sql = "SELECT track_id, title FROM Track WHERE project_id = '$project_id'";
//     $result = $db->query($sql);
//     $tracks = $result->fetchAll(PDO::FETCH_ASSOC);

//     // return ok
//     Flight::json(array(
//        'project_id' => $project_id, 'tracks' => $tracks
//     ), 200);

// } catch (PDOException $pdoException) {
//     Flight::error($pdoException);
// } catch (Exception $exception) {
//         Flight::error($exception);
// } finally {
//     $db = null;
// }
// });

// ///////////////////////////////////////////////////// Routes - /project/password POST /////////////////////////////////////////////////
// Flight::route('POST /project/password', function() {

// $project_id = json_decode(Flight::request()->getBody())->project_id;

// $db = Flight::db();
// $sql = "SELECT password FROM Project WHERE project_id = '$project_id'";
// $result = $db->query($sql);

// Flight::json(array(
//    'project_id' => $project_id,
//    'project_password' => $result->fetch()[0] 
// ), 200);

// });

// //////////////////////////////////////////////////// Routes - /project/delete POST ////////////////////////////////////////////////////
// Flight::route('POST /project/delete', function() {

// $project_id = json_decode(Flight::request()->getBody())->project_id;

// $db = Flight::db();
// $sql = "UPDATE Project SET active = '0' WHERE project_id = '$project_id'";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
// });

// //////////////////////////////////////////////////// Routes - /project/url POST ///////////////////////////////////////////////////////
// Flight::route('POST /project/url', function() {

// $project_id = json_decode(Flight::request()->getBody())->project_id;

// $db = Flight::db();
// $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'project_url' => 'http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com/project/'. $result->fetch()[0],
//    'project_hash' => $result->fetch()[0]
// ), 200);
// });

// /////////////////////////////////////////////// Routes - /project/@project_hash POST //////////////////////////////////////////////////
// Flight::route('/project/@project_hash', function(){
//     include 'index.html';
// });










// /*
// TRACK
// */
// /////////////////////////////////////////////////////// Routes - /track/new POST //////////////////////////////////////////////////////
// Flight::route('POST /track/new', function() {

// $project_id = json_decode(Flight::request()->getBody())->project_id;
// $track_title = isset(json_decode(Flight::request()->getBody())->track_title) ? json_decode(Flight::request()->getBody())->track_title : "";
// $track_artist = isset(json_decode(Flight::request()->getBody())->track_artist) ? json_decode(Flight::request()->getBody())->track_artist : "";

// $db = Flight::db();
// if ($project_id) {
//     $sql = "INSERT INTO Track (title, artist, project_id) VALUES ('$track_title', '$track_artist', '$project_id')";
// } else {
//     $sql = "INSERT INTO Track (title, artist) VALUES ('$track_title', '$track_artist')";
// }
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'track_id' => $db->lastInsertId()
// ), 200);
// });

// //////////////////////////////////////////////////// Routes - /track/version POST /////////////////////////////////////////////////////
// Flight::route('POST /track/version', function() {

// $track_id = json_decode(Flight::request()->getBody())->track_id;
// $downloadable = isset(json_decode(Flight::request()->getBody())->downloadable) ? json_decode(Flight::request()->getBody())->downloadable : 0;
// $visibility = isset(json_decode(Flight::request()->getBody())->visibility) ? json_decode(Flight::request()->getBody())->visibility : 1;
// $version_notes = isset(json_decode(Flight::request()->getBody())->version_notes) ? json_decode(Flight::request()->getBody())->version_notes : "";
// $version_title = isset(json_decode(Flight::request()->getBody())->version_title) ? json_decode(Flight::request()->getBody())->version_title : "";
// $track_length = isset(json_decode(Flight::request()->getBody())->track_length) ? json_decode(Flight::request()->getBody())->track_length : 0;
// $wave_png = isset(json_decode(Flight::request()->getBody())->wave_png) ? json_decode(Flight::request()->getBody())->wave_png : "";

// $db = Flight::db();
// $sql = "INSERT INTO Version (track_id, downloadable, visibility, notes, version_title, track_length, wave_png) VALUES ('$track_id', '$downloadable', '$visibility', '$version_notes', '$version_title', '$track_length', '$wave_png')";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'version_id' => $db->lastInsertId()
// ), 200);
// });

// ///////////////////////////////////////////////////////// Routes - /track GET /////////////////////////////////////////////////////////
// Flight::route('GET /track/@track_id', function($track_id) {

// $db = Flight::db();
// $sql = "SELECT version_id, notes, downloadable, visibility, version_title, track_length, wave_png FROM Version WHERE track_id = '$track_id'";
// $result = $db->query($sql);
// $versions = $result->fetchAll(PDO::FETCH_ASSOC);

// // return ok
// Flight::json(array(
//    'versions' => $versions
// ), 200);
// });

// ///////////////////////////////////////////////////// Routes - /track/version GET /////////////////////////////////////////////////////
// Flight::route('GET /track/version/@version_id', function($version_id) {

// $db = Flight::db();
// $sql = "SELECT file_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE version_id = '$version_id'";
// $result = $db->query($sql);
// $files = $result->fetchAll(PDO::FETCH_ASSOC);

// // return ok
// Flight::json(array(
//    'files' => $files
// ), 200);
// });

// ///////////////////////////////////////////////// Routes - /track/version/comments GET ////////////////////////////////////////////////
// Flight::route('GET /track/version/comments/@version_id', function($version_id) {

// $db = Flight::db();
// $sql = "SELECT comment_id, notes, start_time, end_time, checked, parent_comment_id, name, include_end, include_start, comment_time FROM Comment WHERE version_id = '$version_id'";
// $result = $db->query($sql);
// $comments = $result->fetchAll(PDO::FETCH_ASSOC);

// // return ok
// Flight::json(array(
//    'comments' => $comments
// ), 200);
// });

// ///////////////////////////////////////////////// Routes - /track/version/comment POST ////////////////////////////////////////////////
// Flight::route('POST /track/version/comment', function() {

// $version_id = json_decode(Flight::request()->getBody())->version_id;
// $notes = isset(json_decode(Flight::request()->getBody())->notes) ? json_decode(Flight::request()->getBody())->notes : "";
// $name = isset(json_decode(Flight::request()->getBody())->name) ? json_decode(Flight::request()->getBody())->name : "";
// $start_time = isset(json_decode(Flight::request()->getBody())->start_time) ? json_decode(Flight::request()->getBody())->start_time : "";
// $end_time = isset(json_decode(Flight::request()->getBody())->end_time) ? json_decode(Flight::request()->getBody())->end_time : "";
// $parent_comment_id = isset(json_decode(Flight::request()->getBody())->parent_comment_id) ? json_decode(Flight::request()->getBody())->parent_comment_id : "";
// $include_start = isset(json_decode(Flight::request()->getBody())->include_start) ? json_decode(Flight::request()->getBody())->include_start : "";
// $include_end = isset(json_decode(Flight::request()->getBody())->include_end) ? json_decode(Flight::request()->getBody())->include_end : "";
// $comment_time = isset(json_decode(Flight::request()->getBody())->comment_time) ? json_decode(Flight::request()->getBody())->comment_time : "";

// $db = Flight::db();
// $sql = "INSERT INTO Comment (version_id, notes, name, start_time, end_time, parent_comment_id, include_start, include_end, comment_time) VALUES ('$version_id', '$notes', '$name', '$start_time', '$end_time', '$parent_comment_id', '$include_start', '$include_end', '$comment_time')";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'comment_id' => $db->lastInsertId()
// ), 200);
// });

// ////////////////////////////////////////////////// Routes - /track/file/download GET //////////////////////////////////////////////////
// Flight::route('GET /track/file/download/@file_id', function($file_id) {

// $db = Flight::db();
// $sql = "SELECT aws_path  FROM File WHERE file_id = '$file_id'";
// $result = $db->query($sql);
// $aws_path = $result->fetch()[0];

// // return ok
// Flight::json(array(
//    'aws_path' => $aws_path
// ), 200);
// });










// /*
// FILE
// */
// /////////////////////////////////////////////////////// Routes - /file/new POST ///////////////////////////////////////////////////////
// Flight::route('POST /file/new', function() {

// $version_id = json_decode(Flight::request()->getBody())->version_id;
// $identifier = isset(json_decode(Flight::request()->getBody())->identifier) ? json_decode(Flight::request()->getBody())->identifier : 0;
// $chunk_length = isset(json_decode(Flight::request()->getBody())->chunk_length) ? json_decode(Flight::request()->getBody())->chunk_length : 0;
// $file_size = isset(json_decode(Flight::request()->getBody())->file_size) ? json_decode(Flight::request()->getBody())->file_size : 0;
// $file_name = isset(json_decode(Flight::request()->getBody())->file_name) ? json_decode(Flight::request()->getBody())->file_name : "";
// $metadata = isset(json_decode(Flight::request()->getBody())->metadata) ? json_decode(Flight::request()->getBody())->metadata : "";
// $extension = isset(json_decode(Flight::request()->getBody())->extension) ? json_decode(Flight::request()->getBody())->extension : "";
// $aws_path = "https://s3-eu-west-1.amazonaws.com/soundmarkersass-local-robin/" . $version_id . "/" . $file_name;

// $db = Flight::db();
// $sql = "INSERT INTO File (version_id, file_name, file_size, metadata, extension, chunk_length, identifier, aws_path) VALUES ('$version_id', '$file_name', '$file_size', '$metadata', '$extension', '$chunk_length', '$identifier', '$aws_path')";
// $result = $db->query($sql);
// $file_id = $db->lastInsertId();

// // return ok
// Flight::json(array(
//    'file_id' => $file_id
// ), 200);
// });

// ////////////////////////////////////////////////// Routes - /file/chunk/$file_id POST /////////////////////////////////////////////////
// Flight::route('POST /file/chunk/@file_id/@idno/@ext', function($file_id, $idno, $ext) {

// try {
//   $db = Flight::db();
//   $sql = "SELECT version_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length FROM File WHERE file_id = '$file_id'";
//   $result = $db->query($sql);
//   $files = $result->fetchAll();

//   // get the variables
//   $s3 = Flight::get("s3");
//   $s3bucket = Flight::get("s3bucket");

//     // Upload data.
//     $result = $s3->putObject([
//         'Bucket' => $s3bucket,
//         'Key'    => $files[0]["version_id"] . "/" . $files[0]["file_name"] . $idno .'.' . $files[0]["extension"],
//         'Body'   => Flight::request()->getBody(), // figuring out right way to get the file from the JSON
//         'ACL'    => 'public-read'
//     ]);
//     // return ok
//     Flight::json(array(
//        'ok' => $result['ObjectURL'] . PHP_EOL
//     ), 200);
// } catch (S3Exception $e) {
//     Flight::json(array(
//        'notok' => $e->getMessage() . PHP_EOL
//     ), 200);
// }

// });










// /*
// ADS
// */
// /////////////////////////////////////////////////////////// Routes - /ad GET //////////////////////////////////////////////////////////
// Flight::route('GET /ad', function() {

// // TODO: if nothing returns, show default one, no error
// $db = Flight::db();
// $sql = "SELECT html, ad_id, impressions FROM Ad WHERE priority = '1' AND impressions <= limits";
// $result = $db->query($sql);
// $array = $result->fetchAll();

// $rand = rand(0,(count($array)-1));
// $html = $array[$rand]["html"];
// $ad_id = $array[$rand]["ad_id"];
// $impressions = $array[$rand]["impressions"]+1;

// // return ok
// Flight::json(array(
//    'ad_id' => $ad_id
// ), 200);

// // store impression for new ad
// $sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);
// });

// /////////////////////////////////////////////////////// Routes - /ad/@ad_id GET ///////////////////////////////////////////////////////
// Flight::route('GET /ad/@ad_id', function($ad_id) {

// $db = Flight::db();
// $sql = "SELECT html FROM Ad WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);
// $html = $result->fetch()[0];

// echo stripslashes($html);
// });

// ////////////////////////////////////////////////////////// Routes - /ad POST //////////////////////////////////////////////////////////
// Flight::route('POST /ad', function() {

// $ad_id = json_decode(Flight::request()->getBody())->ad_id;
// $exposure_time = json_decode(Flight::request()->getBody())->exposure_time;
// $clicks = json_decode(Flight::request()->getBody())->clicks;

// $db = Flight::db();
// $sql = "SELECT clicks, exposure_time FROM Ad WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);

// $clicksnew = $result->fetch()[0]["clicks"] + $clicks;
// $exposure_timenew = $result->fetch()[0]["exposure_time"] + $exposure_time;

// $sql = "UPDATE Ad SET exposure_time = '$exposure_timenew' WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);
// $sql = "UPDATE Ad SET clicks = '$clicksnew' WHERE ad_id = '$ad_id'";
// $result = $db->query($sql);

// // get next ad
// $sql = "SELECT html, ad_id, impressions FROM Ad WHERE priority != '0' AND impressions <= limits";
// $result = $db->query($sql);
// $array = $result->fetchAll(PDO::FETCH_ASSOC);

// $rand = rand(0,(count($array)-1));
// $html = $array[$rand]["html"];
// $ad_id = $array[$rand]["ad_id"];
// $impressions = $array[$rand]["impressions"]+1;

// // return ok
// Flight::json(array(
//    'html' => $html, 'ad_id' => $ad_id
// ), 200);

// // store impression for new ad
// $sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id' AND impressions < limit";
// $result = $db->query($sql);
// });






// });


/*
FLIGHT
*/
///////////////////////////////////////////////////////////// Start Flight ////////////////////////////////////////////////////////////
// Flight::start();
?>