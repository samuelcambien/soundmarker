import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
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
      transition(':enter', [style({opacity: 0}), animate(350)
      ]),
      transition(':leave', animate(200, style({opacity: 0})))
    ])
  ]
})
export class ProWarningsPopoverComponent implements OnInit {
  warnings = [];
  warnings_timers = new Array<number>();
  @Output() close = new EventEmitter();

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.getAlert().pipe(throttleTime(1000)
    ).subscribe(message =>
    {
      if(message){
      this.warnings.unshift(message);
      let newTimer = setTimeout(() => this.warnings.splice(-1,1) ,9000);
      this.warnings_timers.unshift(newTimer);
        }
    });
  }

  public closeAlert(index){
    this.warnings.splice(index, 1);
    clearTimeout(this.warnings_timers[index]);
    this.warnings_timers.splice(index, 1);
  }

  closeWarningPopover(){
    this.warnings = [];
    for (let timer of this.warnings_timers) {clearTimeout(timer);}
  }
}
