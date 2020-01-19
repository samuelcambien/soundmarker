import {Component, Input, OnInit} from '@angular/core';
import {Track} from '../model/track';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss']
})
export class ProComponent implements OnInit {

  showSidebar = false;

  constructor() { }

  ngOnInit() {
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }
}
