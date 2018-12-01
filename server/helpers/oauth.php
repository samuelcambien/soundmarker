<?php
function getSubscriptions($token, $config, $now) {
    /**
     * @todo Replace state with environment variable
    */
    $service_url = $config['OAUTH_SERVER_LOCATION'] . '/oauth/me/?state=bla&access_token='.$token;
    $curl = curl_init($service_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // If the url has https and you don't want to verify source certificate

    $curl_response = curl_exec($curl);
    $response = json_decode($curl_response);
    curl_close($curl);

    if (isset($response->subscriptions)) {
      $_SESSION["status"] = $response->subscriptions;
      $_SESSION['ENDTIME'] = $now->getTimestamp() + 60*60*24;
    } else {
      $_SESSION["status"] = "free";
    }

    return $response;
}

class OAuthClient 
{
    
  const VERSION = "1.0.0";
  const RESPONSE_CODE_PARAM = 'code';

  protected $_config = array();
  protected $_accessCode = null;
  protected $_accessToken = null;
  protected $_currentUser = null;
  protected $_httpClientResponse = null;

  /**
   * Setup the OAuth object to be used
   *
   * @todo It may be quicker to simply set the config as the array instead of looping. Not really
   * a big deal but may be a thought.
   *
   * @todo You could add a check to make sure that all the given params are given. This way you can 
   * controll the errors.
  */
  function __construct ( $config )
  {
    $this->_config = $config;
    $this->_endpointUrls = array(
         'authorize'  => $this->config['OAUTH_SERVER_LOCATION'] . 'oauth/authorize/?client_id=%s&redirect_uri=%s&response_type=%s',
         'token'      => $this->config['OAUTH_SERVER_LOCATION'] . 'oauth/token?code=%s&grant_type=authorization_code&client_id=%s',
      );
  }

  /**
   * Get the Access code provided during the authorization request
  */
  protected function getAccessCode ()
  {
    return @$_GET[self::RESPONSE_CODE_PARAM];
  }

  /**
   * Set the Access Token
   * @param [type] $accessToken [description]
  */
  public function setAccessToken ( $accessToken )
  {
    $this->$_accessToken = $accessToken;
  }

  /**
   * Return a caonfig varaible from current object
   * @param  [type] $key [description]
   * @return [type]      [description]
   * 
   * @todo Do proper check for variable instead of surpressing any errors
  */
  public function get_config ($key)
  {
    return @$this->_config[$key];
  } 
}
?>