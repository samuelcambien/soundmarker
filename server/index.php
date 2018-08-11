<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';

////////////////////////////// Setup DB //////////////////////////////
// Setup DB
// register dB
// Flight::register('db', 'PDO', array('mysql:host='.$_SERVER["RDS_HOSTNAME"].';dbname='.$_SERVER["RDS_DB_NAME"], $_SERVER["RDS_USERNAME"], $_SERVER["RDS_PASSWORD"]));
// $db = Flight::db();
// $sql = "SELECT * FROM user WHERE email = '{$email}'";
// $result = $db->query($sql);
// if ($result != false) {
//     return new user($result->fetch_assoc());
// } else {
//     return false;
// }

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

////////////////////////////// Routes - /file/new //////////////////////////////
Flight::route('POST /file/new', function() {
$version_id = Flight::request()->data->version_id;
$stream_identifier = Flight::request()->data->stream_identifier;
$file_id = uniqid();

// get the variables
$s3 = Flight::get("s3");
$s3bucket = Flight::get("s3bucket");

try {
    // Upload data.
    $result = $s3->putObject([
        'Bucket' => $s3bucket,
        'Key'    => $file_id,
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
   'file_id' => $file_id
), 200);
});


////////////////////////////// Routes - /track/url //////////////////////////////
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

////////////////////////////// Start Flight //////////////////////////////
Flight::start();
