<?php
require 'flight/Flight.php';
require 'vendor/autoload.php';

///////////////////////////////////////////////////////////// Setup SES client ////////////////////////////////////////////////////////
use Aws\Ses\SesClient;
use Aws\Exception\AwsException;

$SesClient = new SesClient([
    'profile' => 'ses',
    'version' => '2010-12-01',
    'region'  => 'eu-west-1',
]);


$db = new PDO('mysql:host='.$_SERVER["RDS_HOSTNAME"].';dbname='.$_SERVER["RDS_DB_NAME"], $_SERVER["RDS_USERNAME"], $_SERVER["RDS_PASSWORD"]);

// Get expired notification email
$currentdate = new \DateTime();
$currentdatef = $currentdate->format('Y-m-d H:i:s');
$sql = "SELECT notification_id, emailaddress, senddate, type_id FROM Notification WHERE type = '0' AND status = '0'";
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
        $projectlink = "http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com/project/" . $db->query($sql)->fetch()[0];
        $emailstring = str_replace("%projectlink%",$projectlink,$emailstring);
        $emailstring_text = str_replace("%projectlink%",$projectlink,$emailstring_text);
        // Replace strings -> %recipientmail%
        // not capturing recipients?
        // $emailstring = str_replace("%recipientmail%",$receiver,$emailstring);
        // $emailstring_text = str_replace("%recipientmail%",$receiver,$emailstring_text);
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
            $tracktitle .= $file["file_name"] . "\n";
        }
        $emailstring = str_replace("%tracktitle%",$tracktitle,$emailstring);
        $emailstring_text = str_replace("%tracktitle%",$tracktitle,$emailstring_text);   

        $subject = 'Your tracks have expired';
        $char_set = 'UTF-8';
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

        // Set notification status to 1
        $notification_id = $notification["notification_id"];
        $sql = "UPDATE Notification SET status = '1' WHERE notification_id = '$notification_id'";
        $result = $db->query($sql);
    }
}
?>