import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardTopbarComponent } from './pro-dashboard-topbar.component';

describe('ProDashboardTopbarComponent', () => {
  let component: ProDashboardTopbarComponent;
  let fixture: ComponentFixture<ProDashboardTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
