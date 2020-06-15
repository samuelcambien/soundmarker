import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardSidebarComponent } from './pro-dashboard-sidebar.component';

describe('ProDashboardSidebarComponent', () => {
  let component: ProDashboardSidebarComponent;
  let fixture: ComponentFixture<ProDashboardSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
