import { AppPage } from './app.po';
import {browser, by, element, ExpectedConditions, protractor} from 'protractor';
import { promise } from 'selenium-webdriver';
import * as assert from 'assert';

describe('Test uploading', () => {
  let page: AppPage;
  let filelocation = "/Users/dieterboels/Music/piano0.mp3"

  beforeEach(() => {
    page = new AppPage();
    browser.waitForAngularEnabled(false);
    page.navigateTo();
    element(by.id('accepttc')).isPresent().then((termsNotAccepted)=> {
      if(termsNotAccepted) element(by.id('accepttc')).click()
    });
  });

  it('#1 - Files: ONE - Recepients: NO - Downloads: NO - Notifications: NO', () => {
    // browser.waitForAngular();
    page.getEmailFrom().sendKeys("dieter@soundmarker.com");
    page.getAddTracks().sendKeys(filelocation)
    page.getUploadSubmitButton().click();
    // browser.sleep(5000);
    let copy = element(by.buttonText('Copy link'));
    expect(copy.isPresent()).toBeTruthy();
  });

  it('#2 - Files: ONE - Recepients: TWO - Download: NO - Notifications: NO', () => {
    let emailFromField = page.getEmailFrom();
    let emailToField = page.getEmailTo();
    let notesField = page.getNotesField();
    emailFromField.clear();

    emailFromField.sendKeys("dieter@soundmarker.com");
    notesField.sendKeys("dieterboels@gmail.com");

    page.selectAllMac(notesField);
    page.copyMac(notesField);
    page.pasteMac(emailToField);
    page.selectAllMac(notesField);
    notesField.sendKeys("dieter@soundmarker.com");
    page.selectAllMac(notesField);
    page.copyMac(notesField);
    page.pasteMac(emailToField);
    notesField.clear();

    page.getAddTracks().sendKeys(filelocation)
    page.getUploadSubmitButton().click();
    browser.sleep(3000);

    expect(page.getCopyLinkButton().isPresent()).toBeTruthy();
    page.getCopyLinkField().getAttribute('value').then(function(e) {browser.get(e);});
    browser.sleep(3000);
    expect(element(by.className("player-container")).isPresent()).toBeTruthy();
    expect(element(by.id("cloud-icon")).isPresent()).toBeFalsy();
  });

  it('#3 - File: ONE - Recepients: TWO - Download: YES - Notifications: NO', () => {
    let emailFromField = page.getEmailFrom();
    let emailToField = page.getEmailTo();
    let notesField = page.getNotesField();
    emailFromField.clear();

    emailFromField.sendKeys("dieter@soundmarker.com");
    notesField.sendKeys("dieterboels@gmail.com");

    page.selectAllMac(notesField);
    page.copyMac(notesField);
    page.pasteMac(emailToField);
    page.selectAllMac(notesField);
    notesField.sendKeys("dieter@soundmarker.com");
    page.selectAllMac(notesField);
    page.copyMac(notesField);
    page.pasteMac(emailToField);
    notesField.clear();

    page.getAddTracks().sendKeys(filelocation);
    page.getDownloadEnableButton().click();
    page.getUploadSubmitButton().click();
    browser.sleep(3000);

    expect(page.getCopyLinkButton().isPresent()).toBeTruthy();
    page.getCopyLinkField().getAttribute('value').then(function(e) {browser.get(e);});
    browser.sleep(3000);
    expect(element(by.className("player-container")).isPresent()).toBeTruthy();
    expect(element(by.id("cloud-icon")).isPresent()).toBeTruthy();
  });
});


