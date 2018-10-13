<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';

////////////////////////////// Setup DB //////////////////////////////
// Setup DB
Flight::register('db', 'PDO', array('mysql:host='.$_SERVER["RDS_HOSTNAME"].';dbname='.$_SERVER["RDS_DB_NAME"], $_SERVER["RDS_USERNAME"], $_SERVER["RDS_PASSWORD"]), function($db) {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
});
// SELECT o.*, p.product_id productId, p.name productName, p.price productPrice
//  FROM orders o
//  JOIN products p ON o.product = p.product_id
//  WHERE order_id = :oId

////////////////////////////// Setup S3 client //////////////////////////////
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

$credentials = new Aws\Credentials\Credentials($_SERVER["AWScredentials-username"], $_SERVER["AWScredentials-password"]);
$s3bucket = 'soundmarkersass-local-robin';

$s3 = new Aws\S3\S3Client([
    'version'     => 'latest',
    'region'      => 'eu-west-1',
    'credentials' => $credentials
]);

Flight::set("s3", $s3);
Flight::set("s3bucket", $s3bucket);

////////////////////////////// Routes - Global //////////////////////////////
Flight::route('/', function(){
    include 'index.html';
});

Flight::route('/player/47', function(){
    include 'index.html';
});


////////////////////////////// Routes - /project/new POST //////////////////////////////

Flight::route('POST /project/new', function() {

// Todo: check if user_id exists first (foreign_key needs to be valid) -> put in dB
$user_id = Flight::request()->data->user_id;
$project_title = Flight::request()->data->project_title;
$project_password = Flight::request()->data->project_password;

$db = Flight::db();
$sql = "INSERT INTO Project (title, password, active) VALUES ('$project_title', '$project_password', '1')";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'project_id' => $db->lastInsertId()
), 200);
});


////////////////////////////// Routes - /project/password POST //////////////////////////////

Flight::route('POST /project/password', function() {

$project_id = Flight::request()->data->project_id;

$db = Flight::db();
$sql = "SELECT password FROM Project WHERE project_id = '$project_id'";
$result = $db->query($sql);

Flight::json(array(
   'project_id' => $project_id,
   'project_password' => $result->fetch()[0] 
), 200);

});

////////////////////////////// Routes - /project/delete POST //////////////////////////////

Flight::route('POST /project/delete', function() {

$project_id = Flight::request()->data->project_id;

$db = Flight::db();
$sql = "UPDATE Project SET active = '0' WHERE project_id = '$project_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'project_id' => $project_id
), 200);
});

////////////////////////////// Routes - /track/new POST //////////////////////////////

Flight::route('POST /track/new', function() {

$project_id = Flight::request()->data->project_id;
$track_title = Flight::request()->data->track_title;
$track_artist = Flight::request()->data->track_artist;

$db = Flight::db();
if ($project_id) {
    $sql = "INSERT INTO Track (title, artist, project_id) VALUES ('$track_title', '$track_artist', '$project_id')";
} else {
    $sql = "INSERT INTO Track (title, artist) VALUES ('$track_title', '$track_artist')";
}
$result = $db->query($sql);

// return ok
Flight::json(array(
   'track_id' => $db->lastInsertId()
), 200);
});

////////////////////////////// Routes - /track/version POST //////////////////////////////

Flight::route('POST /track/version', function() {

// Todo: add SVG?
$track_id = Flight::request()->data->track_id;
$streamable = Flight::request()->data->streamable;
$downloadable = Flight::request()->data->downloadable;
$visibility = Flight::request()->data->visibility;
$version_notes = Flight::request()->data->version_notes;
$version_title = Flight::request()->data->version_title;

$db = Flight::db();
$sql = "INSERT INTO Version (track_id, streamable, downloadable, visibility, notes, version_title) VALUES ('$track_id', '$streamable', 'downloadable', '$visibility', '$version_notes', '$version_title')";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'version_id' => $db->lastInsertId()
), 200);
});

////////////////////////////// Routes - /file/new POST //////////////////////////////
Flight::route('POST /file/new', function() {

// Todo: check if files actually get uploaded 
// And put in DB
$version_id = Flight::request()->data->version_id;
$stream_identifier = Flight::request()->data->stream_identifier;

$db = Flight::db();
$sql = "INSERT INTO File (version_id, filename) VALUES ('$version_id', 'bla')";
$result = $db->query($sql);
$file_id = $db->lastInsertId();

// get the variables
// $s3 = Flight::get("s3");
// $s3bucket = Flight::get("s3bucket");

// try {
//     // Upload data.
//     $result = $s3->putObject([
//         'Bucket' => $s3bucket,
//         'Key'    => $file_id,
//         'Body'   => "Flight::request()->files[0]", // figuring out right way to get the file from the JSON
//         'ACL'    => 'public-read'
//     ]);
//     // Print the URL to the object.
//     echo $result['ObjectURL'] . PHP_EOL;
// } catch (S3Exception $e) {
//     echo $e->getMessage() . PHP_EOL;
// }

// return ok
Flight::json(array(
   'file_id' => $file_id
), 200);
});

////////////////////////////// Routes - /file/chunk/$file_id POST //////////////////////////////
Flight::route('POST /file/chunk/@file_id/@idno/@ext', function() {

// // Todo: check if files actually get uploaded 
// // And put in DB
// $version_id = Flight::request()->data->version_id;
// $stream_identifier = Flight::request()->data->stream_identifier;

// $db = Flight::db();
// $sql = "INSERT INTO File (version_id, filename) VALUES ('$version_id', 'bla')";
// $result = $db->query($sql);
// $file_id = $db->lastInsertId();

// get the variables
$s3 = Flight::get("s3");
$s3bucket = Flight::get("s3bucket");

try {
    // Upload data.
    $result = $s3->putObject([
        'Bucket' => $s3bucket,
        'Key'    => $file_id . $idno .'.' . $ext,
        'Body'   => "Flight::request()->files[0]", // figuring out right way to get the file from the JSON
        'ACL'    => 'public-read'
    ]);
    // Print the URL to the object.
    echo $result['ObjectURL'] . PHP_EOL;
} catch (S3Exception $e) {
    echo $e->getMessage() . PHP_EOL;
}

// return ok
Flight::json(array(
   'ok' => 'ok'
), 200);
});


////////////////////////////// Routes - /track/url GET //////////////////////////////
Flight::route('GET /track/url', function() {
$track_id = Flight::request()->data->track_id;

// return ok
Flight::json(array(
   'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/Bruno-LetHerKnow.wav",
   'track_hash' => "hash"
), 200);
});

Flight::route('GET /track/47', function() {
$track_id = Flight::request()->data->track_id;

// return ok
Flight::json(array(
   'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/06pianoconverted.mp3",
   'track_hash' => "hash"
), 200);
});

////////////////////////////// Routes - /track/version/comments GET //////////////////////////////
Flight::route('GET /track/version/comments', function() {
// $track_id = Flight::request()->data->track_id;

// return ok
// Flight::json(array(
//    'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/Bruno-LetHerKnow.wav",
//    'track_hash' => "hash"
// ), 200);
// });

// Flight::route('GET /track/47', function() {
// $track_id = Flight::request()->data->track_id;

// // return ok
// Flight::json(array(
//    'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/06pianoconverted.mp3",
//    'track_hash' => "hash"
// ), 200);
});

////////////////////////////// Routes - /track/version/comment POST //////////////////////////////
Flight::route('POST /track/version/comment', function() {

// // return ok
// Flight::json(array(
//    'file_id' => $file_id
// ), 200);
});

////////////////////////////// Routes - /project GET //////////////////////////////

Flight::route('GET /project', function() {

// $project_id = Flight::request()->data->project_id;

// $db = Flight::db();
// $sql = "UPDATE Project SET active = '0' WHERE project_id = '$project_id'";
// $result = $db->query($sql);

// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
});

////////////////////////////// Routes - /project/url POST //////////////////////////////

Flight::route('POST /project/url', function() {

// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
});

////////////////////////////// Routes - /track/version/download GET //////////////////////////////

Flight::route('GET /track/version/download', function() {

// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
});

////////////////////////////// Routes - /track/version GET //////////////////////////////

Flight::route('GET /track/version', function() {
    
// // return ok
// Flight::json(array(
//    'project_id' => $project_id
// ), 200);
});

////////////////////////////// Start Flight //////////////////////////////
Flight::start();
