import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundmarkerComponent } from './soundmarker.component';

describe('SoundmarkerComponent', () => {
  let component: SoundmarkerComponent;
  let fixture: ComponentFixture<SoundmarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundmarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundmarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
