import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaComponent } from './sma.component';

describe('SmaComponent', () => {
  let component: SmaComponent;
  let fixture: ComponentFixture<SmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
