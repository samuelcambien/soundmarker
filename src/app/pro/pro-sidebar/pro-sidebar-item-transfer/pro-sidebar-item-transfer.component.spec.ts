import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSidebarItemTransferComponent } from './pro-sidebar-item-transfer.component';

describe('ProSidebarItemTransferComponent', () => {
  let component: ProSidebarItemTransferComponent;
  let fixture: ComponentFixture<ProSidebarItemTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSidebarItemTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSidebarItemTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
