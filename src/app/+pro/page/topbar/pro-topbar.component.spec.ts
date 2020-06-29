import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTopbarComponent } from './pro-topbar.component';
import {beforeEach, describe, expect, it} from "@angular/core/testing/src/testing_internal";

describe('ProTopbarComponent', () => {
  let component: ProTopbarComponent;
  let fixture: ComponentFixture<ProTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
