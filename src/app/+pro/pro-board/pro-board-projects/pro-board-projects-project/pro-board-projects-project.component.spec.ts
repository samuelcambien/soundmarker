import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardProjectsProjectComponent } from './pro-board-projects-project.component';

describe('ProBoardProjectsProjectComponent', () => {
  let component: ProBoardProjectsProjectComponent;
  let fixture: ComponentFixture<ProBoardProjectsProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardProjectsProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardProjectsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
