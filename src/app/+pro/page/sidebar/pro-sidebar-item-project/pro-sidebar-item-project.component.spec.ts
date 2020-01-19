import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSidebarItemProjectComponent } from './pro-sidebar-item-project.component';

describe('ProSidebarItemProjectComponent', () => {
  let component: ProSidebarItemProjectComponent;
  let fixture: ComponentFixture<ProSidebarItemProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSidebarItemProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSidebarItemProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
