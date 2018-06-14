import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUploadFinishedComponent } from './public-upload-finished.component';

describe('PublicUploadFinishedComponent', () => {
  let component: PublicUploadFinishedComponent;
  let fixture: ComponentFixture<PublicUploadFinishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUploadFinishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUploadFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
