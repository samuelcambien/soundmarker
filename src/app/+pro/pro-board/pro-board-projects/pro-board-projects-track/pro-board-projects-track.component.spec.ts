import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardProjectsTrackComponent } from './pro-board-projects-track.component';

describe('ProBoardProjectsTrackComponent', () => {
  let component: ProBoardProjectsTrackComponent;
  let fixture: ComponentFixture<ProBoardProjectsTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardProjectsTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardProjectsTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
