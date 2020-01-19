import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSidebarComponent } from './pro-sidebar.component';

describe('ProSidebarComponent', () => {
  let component: ProSidebarComponent;
  let fixture: ComponentFixture<ProSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
