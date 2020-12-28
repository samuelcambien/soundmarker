import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrackFormComponent } from './edit-track-form.component';

describe('EditTrackFormComponent', () => {
  let component: EditTrackFormComponent;
  let fixture: ComponentFixture<EditTrackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTrackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
