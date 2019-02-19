import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pro-topbar',
  templateUrl: './pro-topbar.component.html',
  styleUrls: ['./pro-topbar.component.scss']
})
export class ProTopbarComponent implements OnInit {


  @Output() sidebar = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  toggleSidebar(){
    this.sidebar.emit();
  }
}
