import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardComponent } from './pro-dashboard.component';

describe('ProDashboardComponent', () => {
  let component: ProDashboardComponent;
  let fixture: ComponentFixture<ProDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
