import {Component, OnInit} from '@angular/core';

enum Status {
  SELECT_SONGS, UPLOADING_SONGS, GREAT_SUCCESS
}
@Component({
  selector: 'app-public-upload-page',
  templateUrl: './public-upload-page.component.html',
  styleUrls: ['./public-upload-page.component.scss']
})
export class PublicUploadPageComponent implements OnInit {

  statusEnum = Status;

  status: Status = Status.SELECT_SONGS;

  ngOnInit(): void {
  }
}
