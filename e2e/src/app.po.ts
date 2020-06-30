import {browser, by, element, protractor} from 'protractor';

export class AppPage {
  navigateTo() {
    // return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getAcceptButton(){
    return element(by.buttonText('Get started'));
  }

  getEmailFrom() {
    return element(by.id('emailfrom'));
  }

  getEmailTo() {
    return element(by.xpath("//*[@id=\"tag-input-email\"]//input"));
  }

  getNotesField(){
      return element.all(by.name("notes")).first();
  }

  getAddTracks(){
    return element(by.id('public-uploader'));
  }

  getUploadSubmitButton(){
    return element(by.buttonText("Upload tracks"))
  }

  getDownloadEnableButton(){
    // return element(by.cssContainingText(".slider-text","Downloads"))
    return element(by.id('enable-download-button'));
  }

  getCopyLinkButton(){
    return element(by.buttonText("Copy link"));
  }

  getCopyLinkField(){
    return element(by.id("copy-link"));
  }

  selectAllMac(element){
    element.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.HOME));
  }

  copyMac(element){
    element.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.INSERT));
  }

  pasteMac(element){
    element.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT));
  }

  getVisiblePlayButton(){
    let playButtons = element.all(by.tagName('play-button'));
    let playbutton = playButtons.filter(elem => {
      return elem.isDisplayed().then(displayedElement => {
        // console.log("################################################################################################################################");
        // console.log(elem);
        // console.log(displayedElement);
        return displayedElement;
      })
    });
    return playbutton.get(0);
  }

  getWaveForm(){
    return element.all(by.id("waveform")).get(1);
  }
}
