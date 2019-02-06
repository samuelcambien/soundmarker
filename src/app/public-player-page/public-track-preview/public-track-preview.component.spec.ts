import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTrackPreviewComponent } from './public-track-preview.component';

describe('PublicPlayerTrackComponent', () => {
  let component: PublicTrackPreviewComponent;
  let fixture: ComponentFixture<PublicTrackPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTrackPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTrackPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
