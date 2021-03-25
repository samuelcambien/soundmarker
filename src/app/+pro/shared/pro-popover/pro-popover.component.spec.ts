import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPopoverComponent } from './pro-popover.component';

describe('ProPopoverComponent', () => {
  let component: ProPopoverComponent;
  let fixture: ComponentFixture<ProPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
