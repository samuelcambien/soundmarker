import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'src/app/tools/ng2-file-upload/ng2-file-upload';

import { PublicUploadFormComponent } from './public-upload-form.component';

describe('PublicUploadFormComponent', () => {
  let component: PublicUploadFormComponent;
  let fixture: ComponentFixture<PublicUploadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUploadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
