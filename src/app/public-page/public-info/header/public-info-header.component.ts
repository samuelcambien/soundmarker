import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubscribeComponent} from "../../../subscribe/subscribe.component";
import {Message} from "../../../message";
import {ProjectService} from "../../../services/project.service";

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
    public projectService: ProjectService
  ) {
  }

  ngOnInit() {
  }

  subscribe() {
    this.modalService.open(SubscribeComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  goToPage() {
    window.history.replaceState({}, '', `/uploading-files-dev`);
  }

  showAutoplayToggle(): boolean {
    return this.projectService.getActiveProject()
      && this.projectService.getActiveProject().tracks.length > 1 && this.message.enableNotifications;
  }
}
