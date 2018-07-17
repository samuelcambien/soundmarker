import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlayerPageComponent } from './public-player-page.component';

describe('PublicPlayerPageComponent', () => {
  let component: PublicPlayerPageComponent;
  let fixture: ComponentFixture<PublicPlayerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPlayerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
