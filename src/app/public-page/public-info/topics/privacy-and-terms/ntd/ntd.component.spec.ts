import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NtdComponent} from './ntd.component';

describe('NtdComponent', () => {
  let component: NtdComponent;
  let fixture: ComponentFixture<NtdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
