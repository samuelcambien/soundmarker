import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUploadFinishedComponent } from './pro-upload-finished.component';

describe('ProUploadFinishedComponent', () => {
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
