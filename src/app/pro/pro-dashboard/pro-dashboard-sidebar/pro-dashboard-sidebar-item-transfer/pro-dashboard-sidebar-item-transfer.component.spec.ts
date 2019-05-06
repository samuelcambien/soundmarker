import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardSidebarItemTransferComponent } from './pro-dashboard-sidebar-item-transfer.component';

describe('ProDashboardSidebarItemTransferComponent', () => {
  let component: ProDashboardSidebarItemTransferComponent;
  let fixture: ComponentFixture<ProDashboardSidebarItemTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardSidebarItemTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardSidebarItemTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
