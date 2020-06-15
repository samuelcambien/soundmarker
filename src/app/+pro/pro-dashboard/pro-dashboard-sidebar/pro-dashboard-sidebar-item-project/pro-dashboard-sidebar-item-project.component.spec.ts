import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardSidebarItemProjectComponent } from './pro-dashboard-sidebar-item-project.component';

describe('ProDashboardSidebarItemProjectComponent', () => {
  let component: ProDashboardSidebarItemProjectComponent;
  let fixture: ComponentFixture<ProDashboardSidebarItemProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardSidebarItemProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardSidebarItemProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
