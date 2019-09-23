import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaLazyComponent } from './sma-lazy.component';

describe('SmaLazyComponent', () => {
  let component: SmaLazyComponent;
  let fixture: ComponentFixture<SmaLazyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmaLazyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaLazyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
