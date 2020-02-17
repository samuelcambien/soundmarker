import {Component} from '@angular/core';
import {Uploader} from '../../services/uploader.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-pro',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}),animate(350)
      ]),
      transition(':leave',animate(200, style({opacity: 0})))
    ])
  ]
})
export class ProPageComponent {
  constructor(private uploader: Uploader){

  }

}
