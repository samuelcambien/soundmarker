import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StateService} from '../../../services/state.service';
import {debounceTime, throttleTime} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-pro-warnings-popover',
  templateUrl: './pro-warnings-popover.component.html',
  styleUrls: ['./pro-warnings-popover.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}), animate(1000)
      ]),
      transition(':leave', animate(1000, style({opacity: 0})))
    ])
  ]
})
export class ProWarningsPopoverComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() alert = alert;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  closeAlert(){
    this.close.emit();
  }
}
