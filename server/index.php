<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';

// Unique ID
// class UUID {
//   public static function v3($namespace, $name) {
//     if(!self::is_valid($namespace)) return false;

//     // Get hexadecimal components of namespace
//     $nhex = str_replace(array('-','{','}'), '', $namespace);

//     // Binary Value
//     $nstr = '';

//     // Convert Namespace UUID to bits
//     for($i = 0; $i < strlen($nhex); $i+=2) {
//       $nstr .= chr(hexdec($nhex[$i].$nhex[$i+1]));
//     }

//     // Calculate hash value
//     $hash = md5($nstr . $name);

//     return sprintf('%08s-%04s-%04x-%04x-%12s',

//       // 32 bits for "time_low"
//       substr($hash, 0, 8),

//       // 16 bits for "time_mid"
//       substr($hash, 8, 4),

//       // 16 bits for "time_hi_and_version",
//       // four most significant bits holds version number 3
//       (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x3000,

//       // 16 bits, 8 bits for "clk_seq_hi_res",
//       // 8 bits for "clk_seq_low",
//       // two most significant bits holds zero and one for variant DCE1.1
//       (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,

//       // 48 bits for "node"
//       substr($hash, 20, 12)
//     );
//   }

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

//   public static function v5($namespace, $name) {
//     if(!self::is_valid($namespace)) return false;

//     // Get hexadecimal components of namespace
//     $nhex = str_replace(array('-','{','}'), '', $namespace);

//     // Binary Value
//     $nstr = '';

//     // Convert Namespace UUID to bits
//     for($i = 0; $i < strlen($nhex); $i+=2) {
//       $nstr .= chr(hexdec($nhex[$i].$nhex[$i+1]));
//     }

//     // Calculate hash value
//     $hash = sha1($nstr . $name);

//     return sprintf('%08s-%04s-%04x-%04x-%12s',

//       // 32 bits for "time_low"
//       substr($hash, 0, 8),

//       // 16 bits for "time_mid"
//       substr($hash, 8, 4),

//       // 16 bits for "time_hi_and_version",
//       // four most significant bits holds version number 5
//       (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x5000,

//       // 16 bits, 8 bits for "clk_seq_hi_res",
//       // 8 bits for "clk_seq_low",
//       // two most significant bits holds zero and one for variant DCE1.1
//       (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,

//       // 48 bits for "node"
//       substr($hash, 20, 12)
//     );
//   }

//   public static function is_valid($uuid) {
//     return preg_match('/^\{?[0-9a-f]{8}\-?[0-9a-f]{4}\-?[0-9a-f]{4}\-?'.
//                       '[0-9a-f]{4}\-?[0-9a-f]{12}\}?$/i', $uuid) === 1;
//   }
// }

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

$credentials = new Aws\Credentials\Credentials("AKIAJ2I2I4CLJHCP3NPQ", "H31YdXr6TwoC8lRCSrFhA4n5JXZsiBIuqezP9P+b");
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
// Add expiration date
$user_id = isset(json_decode(Flight::request()->getBody())->user_id) ? json_decode(Flight::request()->getBody())->user_id : "";
$project_title = isset(json_decode(Flight::request()->getBody())->project_title) ? json_decode(Flight::request()->getBody())->project_title : "";
$project_password = isset(json_decode(Flight::request()->getBody())->project_password) ? json_decode(Flight::request()->getBody())->project_password : "";

$db = Flight::db();
$sql = "INSERT INTO Project (title, password, active) VALUES ('$project_title', '$project_password', '1')";
$result = $db->query($sql);
$project_id = $db->lastInsertId();

$uuid = str_replace(".","-",uniqid('', true));
$sql = "UPDATE Project SET hash = '$uuid' WHERE project_id = '$project_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'project_id' => $project_id
), 200);
});

////////////////////////////// Routes - /track/new POST //////////////////////////////

Flight::route('POST /track/new', function() {

$project_id = json_decode(Flight::request()->getBody())->project_id;
$track_title = isset(json_decode(Flight::request()->getBody())->track_title) ? json_decode(Flight::request()->getBody())->track_title : "";
$track_artist = isset(json_decode(Flight::request()->getBody())->track_artist) ? json_decode(Flight::request()->getBody())->track_artist : "";

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
$track_id = json_decode(Flight::request()->getBody())->track_id;
$downloadable = isset(json_decode(Flight::request()->getBody())->downloadable) ? json_decode(Flight::request()->getBody())->downloadable : 0;
$visibility = isset(json_decode(Flight::request()->getBody())->visibility) ? json_decode(Flight::request()->getBody())->visibility : 1;
$version_notes = isset(json_decode(Flight::request()->getBody())->version_notes) ? json_decode(Flight::request()->getBody())->version_notes : "";
$version_title = isset(json_decode(Flight::request()->getBody())->version_title) ? json_decode(Flight::request()->getBody())->version_title : "";
$wave_png = isset(json_decode(Flight::request()->getBody())->wave_png) ? json_decode(Flight::request()->getBody())->wave_png : "";

$db = Flight::db();
$sql = "INSERT INTO Version (track_id, downloadable, visibility, notes, version_title, wave_png) VALUES ('$track_id', '$downloadable', '$visibility', '$version_notes', '$version_title', '$wave_png')";
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
$version_id = json_decode(Flight::request()->getBody())->version_id;
$identifier = isset(json_decode(Flight::request()->getBody())->identifier) ? json_decode(Flight::request()->getBody())->identifier : 0;
$track_length = isset(json_decode(Flight::request()->getBody())->track_length) ? json_decode(Flight::request()->getBody())->track_length : 0;
$chunk_length = isset(json_decode(Flight::request()->getBody())->chunk_length) ? json_decode(Flight::request()->getBody())->chunk_length : 0;
$file_size = isset(json_decode(Flight::request()->getBody())->file_size) ? json_decode(Flight::request()->getBody())->file_size : 0;
$file_name = isset(json_decode(Flight::request()->getBody())->file_name) ? json_decode(Flight::request()->getBody())->file_name : "";
$metadata = isset(json_decode(Flight::request()->getBody())->metadata) ? json_decode(Flight::request()->getBody())->metadata : "";
$extension = isset(json_decode(Flight::request()->getBody())->extension) ? json_decode(Flight::request()->getBody())->extension : "";
$aws_path = "https://s3-eu-west-1.amazonaws.com/soundmarkersass-local-robin/" . $file_name . "." . $extension;

$db = Flight::db();
$sql = "INSERT INTO File (version_id, file_name, file_size, metadata, extension, chunk_length, track_length, identifier, aws_path) VALUES ('$version_id', '$file_name', '$file_size', '$metadata', '$extension', '$chunk_length', '$track_length' , '$identifier', '$aws_path')";
$result = $db->query($sql);
$file_id = $db->lastInsertId();

// return ok
Flight::json(array(
   'file_id' => $file_id
), 200);
});

////////////////////////////// Routes - /file/chunk/$file_id POST //////////////////////////////
Flight::route('POST /file/chunk/@file_id/@idno/@ext', function($file_id, $idno, $ext) {

try {
  $db = Flight::db();
  $sql = "SELECT extension, metadata, aws_path, file_name, file_size, identifier, chunk_length, track_length FROM File WHERE file_id = '$file_id'";
  $result = $db->query($sql);
  $files = $result->fetchAll();

  // get the variables
  $s3 = Flight::get("s3");
  $s3bucket = Flight::get("s3bucket");

    // Upload data.
    $result = $s3->putObject([
        'Bucket' => $s3bucket,
        'Key'    => $file_id . $files[0]["file_name"] .'.' . $files[0]["extension"],
        'Body'   => Flight::request()->getBody(), // figuring out right way to get the file from the JSON
        'ACL'    => 'public-read'
    ]);
    // return ok
    Flight::json(array(
       'ok' => $result['ObjectURL'] . PHP_EOL
    ), 200);
} catch (S3Exception $e) {
    Flight::json(array(
       'notok' => $e->getMessage() . PHP_EOL
    ), 200);
}

});

////////////////////////////// Routes - /project/get/@project_hash POST //////////////////////////////
Flight::route('POST /project/get/url', function() {

$project_id = isset(json_decode(Flight::request()->getBody())->project_id) ? json_decode(Flight::request()->getBody())->project_id : "";

$db = Flight::db();
try {
    $sql = "SELECT project_id FROM Project WHERE hash = '$project_hash'";
    $result = $db->query($sql);
    $project_id = $result->fetch()[0];

    $sql = "SELECT track_id, title FROM Track WHERE project_id = '$project_id'";
    $result = $db->query($sql);
    $tracks = $result->fetchAll(PDO::FETCH_ASSOC);

    // return ok
    Flight::json(array(
       'project_id' => $project_id, 'tracks' => $tracks
    ), 200);

} catch (PDOException $pdoException) {
    Flight::error($pdoException);
} catch (Exception $exception) {
        Flight::error($exception);
} finally {
    $db = null;
}
});

////////////////////////////// Routes - Global //////////////////////////////
Flight::route('/project/@project_hash', function(){
    include 'index.html';
});

////////////////////////////// Routes - /track GET //////////////////////////////
Flight::route('GET /track/@track_id', function($track_id) {

$db = Flight::db();
$sql = "SELECT version_id, notes, downloadable, visibility, version_title, wave_png FROM Version WHERE track_id = '$track_id'";
$result = $db->query($sql);
$versions = $result->fetchAll(PDO::FETCH_ASSOC);

// return ok
Flight::json(array(
   'versions' => $versions
), 200);
});

////////////////////////////// Routes - /track/version GET //////////////////////////////
Flight::route('GET /track/version/@version_id', function($version_id) {

$db = Flight::db();
$sql = "SELECT file_id, extension, metadata, aws_path, file_name, file_size, identifier, chunk_length, track_length FROM File WHERE version_id = '$version_id'";
$result = $db->query($sql);
$files = $result->fetchAll(PDO::FETCH_ASSOC);

// return ok
Flight::json(array(
   'files' => $files
), 200);
});

////////////////////////////// Routes - /track/version/comments GET //////////////////////////////
Flight::route('GET /track/version/comments/@version_id', function($version_id) {

$db = Flight::db();
$sql = "SELECT comment_id, notes, start_time, end_time, checked, parent_comment_id, name FROM Comment WHERE version_id = '$version_id'";
$result = $db->query($sql);
$comments = $result->fetchAll(PDO::FETCH_ASSOC);

// return ok
Flight::json(array(
   'comments' => $comments
), 200);
});

////////////////////////////// Routes - /track/version/comment POST //////////////////////////////
Flight::route('POST /track/version/comment', function() {

$version_id = json_decode(Flight::request()->getBody())->version_id;
$notes = isset(json_decode(Flight::request()->getBody())->notes) ? json_decode(Flight::request()->getBody())->notes : "";
$name = isset(json_decode(Flight::request()->getBody())->name) ? json_decode(Flight::request()->getBody())->name : "";
$start_time = isset(json_decode(Flight::request()->getBody())->start_time) ? json_decode(Flight::request()->getBody())->start_time : "";
$end_time = isset(json_decode(Flight::request()->getBody())->end_time) ? json_decode(Flight::request()->getBody())->end_time : "";
$parent_comment_id = isset(json_decode(Flight::request()->getBody())->parent_comment_id) ? json_decode(Flight::request()->getBody())->parent_comment_id : "";

$db = Flight::db();
$sql = "INSERT INTO Comment (version_id, notes, name, start_time, end_time, parent_comment_id) VALUES ('$version_id', '$notes', '$name', '$start_time', '$end_time', '$parent_comment_id')";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'comment_id' => $db->lastInsertId()
), 200);
});

////////////////////////////// Routes - /track/file/download GET //////////////////////////////
Flight::route('GET /track/file/download/@file_id', function($file_id) {

$db = Flight::db();
$sql = "SELECT aws_path  FROM File WHERE file_id = '$file_id'";
$result = $db->query($sql);
$aws_path = $result->fetch()[0];

// return ok
Flight::json(array(
   'aws_path' => $aws_path
), 200);
});

////////////////////////////// Routes - /ad GET //////////////////////////////
Flight::route('GET /ad', function() {

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
   'ad_id' => $ad_id
), 200);

// store impression for new ad
$sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
});

////////////////////////////// Routes - /ad/@ad_id GET //////////////////////////////
Flight::route('GET /ad/@ad_id', function($ad_id) {

$db = Flight::db();
$sql = "SELECT html FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$html = $result->fetch()[0];

// return ok
Flight::json(array(
   'html' => $html
), 200);
});

////////////////////////////// Routes - /ad POST //////////////////////////////

Flight::route('POST /ad', function() {

$ad_id = json_decode(Flight::request()->getBody())->ad_id;
$exposure_time = json_decode(Flight::request()->getBody())->exposure_time;
$clicks = json_decode(Flight::request()->getBody())->clicks;

$db = Flight::db();
$sql = "SELECT clicks, exposure_time FROM Ad WHERE ad_id = '$ad_id'";
$result = $db->query($sql);

$clicksnew = $result->fetch()[0]["clicks"] + $clicks;
$exposure_timenew = $result->fetch()[0]["exposure_time"] + $exposure_time;

$sql = "UPDATE Ad SET exposure_time = '$exposure_timenew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);
$sql = "UPDATE Ad SET clicks = '$clicksnew' WHERE ad_id = '$ad_id'";
$result = $db->query($sql);

// get next ad
$sql = "SELECT html, ad_id, impressions FROM Ad WHERE priority != '0' AND impressions <= limits";
$result = $db->query($sql);
$array = $result->fetchAll(PDO::FETCH_ASSOC);

$rand = rand(0,(count($array)-1));
$html = $array[$rand]["html"];
$ad_id = $array[$rand]["ad_id"];
$impressions = $array[$rand]["impressions"]+1;

// return ok
Flight::json(array(
   'html' => $html, 'ad_id' => $ad_id
), 200);

// store impression for new ad
$sql = "UPDATE Ad SET impressions = '$impressions' WHERE ad_id = '$ad_id' AND impressions < limit";
$result = $db->query($sql);
});

////////////////////////////// Routes - /track/url GET //////////////////////////////
// still necessary?
Flight::route('GET /track/url', function() {
$track_id = json_decode(Flight::request()->getBody())->track_id;

// return ok
Flight::json(array(
   'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/Bruno-LetHerKnow.wav",
   'track_hash' => "hash"
), 200);
});

Flight::route('GET /track/47', function() {
$track_id = json_decode(Flight::request()->getBody())->track_id;

// return ok
Flight::json(array(
   'track_url' => "https://d3k08uu3zdbsgq.cloudfront.net/06pianoconverted.mp3",
   'track_hash' => "hash"
), 200);
});

////////////////////////////// Routes - /project/url POST //////////////////////////////

Flight::route('POST /project/url', function() {

$project_id = json_decode(Flight::request()->getBody())->project_id;

$db = Flight::db();
$sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'project_url' => 'http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com/project/'. $result->fetch()[0],
   'project_hash' => $result->fetch()[0]
), 200);
});

////////////////////////////// Routes - /project/password POST //////////////////////////////

Flight::route('POST /project/password', function() {

$project_id = json_decode(Flight::request()->getBody())->project_id;

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

$project_id = json_decode(Flight::request()->getBody())->project_id;

$db = Flight::db();
$sql = "UPDATE Project SET active = '0' WHERE project_id = '$project_id'";
$result = $db->query($sql);

// return ok
Flight::json(array(
   'project_id' => $project_id
), 200);
});

////////////////////////////// Start Flight //////////////////////////////
Flight::start();
