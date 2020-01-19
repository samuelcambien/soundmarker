import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayerIntroductionComponent} from './player-introduction.component';

describe('PlayerIntroductionComponent', () => {
  let component: PlayerIntroductionComponent;
  let fixture: ComponentFixture<PlayerIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
