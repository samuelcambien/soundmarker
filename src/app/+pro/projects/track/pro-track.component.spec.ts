import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTrackComponent } from './pro-track.component';

describe('ProBoardProjectsTrackComponent', () => {
  let component: ProTrackComponent;
  let fixture: ComponentFixture<ProTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
