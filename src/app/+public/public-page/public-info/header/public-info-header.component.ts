import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubscribeComponent} from "../../../subscribe/subscribe.component";
import {Message} from "../../../../message";
import {StateService} from "../../../../services/state.service";
import {ProjectService} from "../../../../services/project.service";
import {DemoComponent} from '../topics/demo/demo.component';

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() message: Message;
  @Input() error;
  @Output() openIntroduction = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    public projectService: ProjectService,
    public stateService: StateService
  ) {
  }

  ngOnInit() {
  }

  goToPage() {
    window.history.replaceState({}, '', `/uploading-files-dev`);
  }

  showAutoplayToggle(): boolean {
    return this.stateService.getActiveProject()
      && this.stateService.getActiveProject().tracks.length > 1 && this.message && this.message.enableNotifications;
  }
}
