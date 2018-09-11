import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlayerTrackComponent } from './public-player-track.component';

describe('PublicPlayerTrackComponent', () => {
  let component: PublicPlayerTrackComponent;
  let fixture: ComponentFixture<PublicPlayerTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPlayerTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlayerTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
