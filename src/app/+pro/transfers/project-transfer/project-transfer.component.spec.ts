import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTransferComponent } from './project-transfer.component';

describe('ProjectTransferComponent', () => {
  let component: ProjectTransferComponent;
  let fixture: ComponentFixture<ProjectTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
