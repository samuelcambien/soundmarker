import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicIntroductionComponent} from './public-introduction.component';

describe('PublicIntroductionComponent', () => {
  let component: PublicIntroductionComponent;
  let fixture: ComponentFixture<PublicIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
