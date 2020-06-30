import { AppPage } from './app.po';
import {browser, by, element, ExpectedConditions, protractor} from 'protractor';
import { promise } from 'selenium-webdriver';
import * as assert from 'assert';

describe('Test uploading', () => {
  let page: AppPage;
  let project_1_file_no_download = "30b7ed64-e945-410d-91ba-f159d8af95205b66d3b7-debe-417e-823f-331e3cb84a9b"

  beforeEach(() => {
    page = new AppPage();
    browser.waitForAngularEnabled(false);
    browser.get("/project/" + project_1_file_no_download);
    page.getAcceptButton().isPresent().then((termsNotAccepted)=> {
      if(termsNotAccepted) page.getAcceptButton().click()
    });
  });

  it('#1 - Player: Play + pause + no download', () => {

    page.getVisiblePlayButton().click();
    browser.sleep(2500);
    page.getVisiblePlayButton().click();
    browser.sleep(4000);
    // browser.executeScript("arguments[0].click();", page.getVisiblePlayButton());
    // page.getVisiblePlayButton().click();
    // browser.actions().mouseMove({x: 0, y: 0}).perform();
    // browser.driver.executeScript("arguments[0].setAttribute('style', arguments[1]);",page.getVisiblePlayButton().getWebElement(), "color: Red; border: 2px solid red;").
    // then(() => {
      browser.sleep(4000);
    // });
  });
});
    // browser.sleep(3000);
    // browser.driver.actions().mouseMove(page.getWaveForm(),{x: 150,y:0}).click().perform();
    // page.getVisiblePlayButton().click();
    // browser.sleep(3000);
    // page.getVisiblePlayButton().click();



