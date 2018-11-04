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

        $sql = "SELECT email_string FROM Emails WHERE email_name = 'soundmarker-expiration-expired-email-to sender'";
        $emailstring = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');
        $sql = "SELECT email_string_text FROM Emails WHERE email_name = 'soundmarker-expiration-expired-email-to sender'";
        $emailstring_text = html_entity_decode($db->query($sql)->fetch()[0], ENT_COMPAT, 'ISO-8859-1');

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
    }
}
?>