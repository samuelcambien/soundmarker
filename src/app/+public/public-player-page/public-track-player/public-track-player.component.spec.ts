import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTrackPlayerComponent } from './public-track-player.component';

describe('PublicTrackPlayerComponent', () => {
  let component: PublicTrackPlayerComponent;
  let fixture: ComponentFixture<PublicTrackPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTrackPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTrackPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
