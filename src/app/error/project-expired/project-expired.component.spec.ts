import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExpiredComponent } from './project-expired.component';

describe('ProjectExpiredComponent', () => {
  let component: ProjectExpiredComponent;
  let fixture: ComponentFixture<ProjectExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
