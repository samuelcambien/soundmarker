import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUploadPopoverComponent } from './pro-upload-popover.component';

describe('ProUploadPopoverComponent', () => {
  let component: ProUploadPopoverComponent;
  let fixture: ComponentFixture<ProUploadPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUploadPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUploadPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
