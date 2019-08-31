<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';
require 'credentials.php';

///////////////////////////////////////////////////////////// Setup SES client ////////////////////////////////////////////////////////
use Aws\Ses\SesClient;
use Aws\Exception\AwsException;

$SesClient = new SesClient([
    'profile' => 'ses',
    'version' => '2010-12-01',
    'region'  => 'eu-west-1',
]);

$db = new PDO('mysql:host='.$config["RDS_HOSTNAME"].';dbname='.$config["RDS_DB_NAME"], $config["RDS_USERNAME"], $config["RDS_PASSWORD"]);

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

$s3 = new Aws\S3\S3Client([
    'profile'     => 's3',
    'version'     => 'latest',
    'region'      => $config['AWS_S3_REGION'],
]);

// Delete files from AWS S3
$sql = "SELECT project_id FROM Project WHERE active = '1' AND user_id IS NULL AND expiration_date < CURDATE()";
$projectstobedeleted = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
foreach ($projectstobedeleted as &$projecttobedeleted) {
  // get all tracks from project
  $deletethisproject = $projecttobedeleted["project_id"];
  $sqltrack = "SELECT track_id FROM Track WHERE project_id = '$deletethisproject'";
  $trackstobedeleted = $db->query($sqltrack)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($trackstobedeleted as &$tracktobedeleted) {
      // get all versions from track
      $deletethistrack = $tracktobedeleted["track_id"];
      $sqlversion = "SELECT version_id FROM Version WHERE track_id = '$deletethistrack'";
      $versionstobedeleted = $db->query($sqlversion)->fetchAll(PDO::FETCH_ASSOC);
      foreach ($versionstobedeleted as &$versiontobedeleted) {
          $iterator = $s3->getIterator('ListObjects', array(
              'Bucket' => $config['AWS_S3_BUCKET'],
              'Prefix' => $versiontobedeleted["version_id"].'/' 
          ));

          foreach($iterator as $i=>$val)
          {
            $result = $s3->deleteObject([
                'Bucket' => $config['AWS_S3_BUCKET'],
                'Key'    => $val["Key"]
            ]);
          }  
      }
  }
  $sqlsetproject = "UPDATE Project SET active = '0' WHERE project_id = '$deletethisproject'";
  $result = $db->query($sqlsetproject);
}

// Get expired notification email
$currentdate = new \DateTime();
$currentdatef = $currentdate->format('Y-m-d H:i:s');
$sql = "SELECT notification_id, emailaddress, senddate, type_id, recipientemail FROM Notification WHERE type = '0' AND status = '0'";
$notifications = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
foreach ($notifications as &$notification) {
    if ($notification["senddate"] < $currentdatef) {
        $project_id = $notification["type_id"];

        $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-expiration-expired-email-to sender'";
        $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
        $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-expiration-expired-email-to sender'";
        $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');

        // Replace strings
        // Replace strings -> %projectlink%
        $sql = "SELECT hash FROM Project WHERE project_id = '$project_id'";
        $projectlink = $config['SERVER_URL']. "/project/" . $db->query($sql)->fetch()[0];
        $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
        $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
        // Replace strings -> %recipientmail%
        $receiver = $notification["recipientemail"];
        $emailstring = str_replace("%recipientmail%",$receiver,$emailstring);
        $emailstring_text = str_replace("%recipientmail%",$receiver,$emailstring_text);
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
            $tracktitle .= urldecode($file["file_name"]) . "<br>";
        }
        $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
        $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   

        $subject = 'Your tracks have expired';
        $char_set = 'UTF-8';
        if (count($files) < 100) {
          try {
              $result = $SesClient->sendEmail([
                  'Destination' => [
                      'ToAddresses' => [$notification["emailaddress"]],
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
        }

        // Set notification status to 1
        $notification_id = $notification["notification_id"];
        $sql = "UPDATE Notification SET status = '1' WHERE notification_id = '$notification_id'";
        $result = $db->query($sql);
    }
}
unset($versions);
unset($versions2);
unset($tracks);
unset($files);

?>
