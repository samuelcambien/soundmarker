import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-pro-board-card',
  templateUrl: './pro-board-card.component.html',
  styleUrls: ['./pro-board-card.component.scss']
})
export class ProBoardCardComponent implements OnInit, AfterViewInit {

  @ViewChild('contentchild') menu;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    // console.log(this.menu.nativeElement.childNodes.length);
  }

  showMenu(){
    return this.menu.nativeElement.childNodes.length>1;
  }
}
