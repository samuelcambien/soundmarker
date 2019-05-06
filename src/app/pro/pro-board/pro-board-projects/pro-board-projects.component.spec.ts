import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardProjectsComponent } from './pro-board-projects.component';

describe('ProBoardProjectsComponent', () => {
  let component: ProBoardProjectsComponent;
  let fixture: ComponentFixture<ProBoardProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
