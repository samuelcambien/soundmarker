import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { ProUploadFormComponent } from './pro-upload-form.component';

describe('ProUploadFormComponent', () => {
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
