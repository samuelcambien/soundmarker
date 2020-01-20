import {Component, Input} from '@angular/core';
import {Message} from "../../../../../message";
import {Utils} from '../../../../../app.component';

@Component({
  selector: 'app-player-introduction',
  templateUrl: './player-introduction.component.html',
  styleUrls: ['./player-introduction.component.scss']
})
export class PlayerIntroductionComponent{

  @Input() message: Message;
  @Input() sender;
  @Input() expiry_date;
  @Input() expired;

  constructor() {
  }

  getDateHumanized() {
    if(this.expiry_date) {
      Utils.getDaysDiff(this.expiry_date);
      return Utils.getDateHumanized(this.expiry_date);
    }
    return null;
  }

  getDaysToExpired() {
    if(this.expiry_date) {
      return Utils.getDaysDiff(this.expiry_date);
    }
    return null;
  }

}
