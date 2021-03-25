import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProWarningsPopoverComponent } from './pro-warnings-popover.component';

describe('ProWarningsPopoverComponent', () => {
  let component: ProWarningsPopoverComponent;
  let fixture: ComponentFixture<ProWarningsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProWarningsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProWarningsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
