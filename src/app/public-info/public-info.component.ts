import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-public-info',
  styleUrls: ['./public-info.component.scss']
})
export abstract class PublicInfoComponent implements OnInit {

  title: string;

  constructor(title: string) {
    this.title = title;
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-about-us-info',
  templateUrl: './topics/about-us/about-us-info.component.html',
  styleUrls: ['./topics/about-us/about-us-info.component.scss']
})
export class AboutUsInfoComponent extends PublicInfoComponent implements OnInit {

  constructor() {
    super("About Us");
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-help-info',
  templateUrl: './topics/help/help-info.component.html',
  styleUrls: ['./topics/help/help-info.component.scss']
})
export class HelpInfoComponent extends PublicInfoComponent implements OnInit {

  constructor() {
    super("Help");
  }
}

@Component({
  selector: 'app-pro-info',
  templateUrl: './topics/pro/pro-info.component.html',
  styleUrls: ['./topics/pro/pro-info.component.scss']
})
export class ProInfoComponent extends PublicInfoComponent implements OnInit {

  constructor() {
    super("Pro");
  }

  ngOnInit() {
  }
}
