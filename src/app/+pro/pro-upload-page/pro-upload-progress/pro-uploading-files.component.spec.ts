import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUploadingFilesComponent } from './public-uploading-files.component';

describe('PublicUploadingFilesComponent', () => {
  let component: PublicUploadingFilesComponent;
  let fixture: ComponentFixture<PublicUploadingFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUploadingFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUploadingFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
