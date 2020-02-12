import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUploadStartComponent } from './pro-upload-start.component';

describe('ProUploadStartComponent', () => {
  let component: ProUploadStartComponent;
  let fixture: ComponentFixture<ProUploadStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUploadStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUploadStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
