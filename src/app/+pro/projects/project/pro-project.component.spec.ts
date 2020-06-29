import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProjectComponent } from './pro-project.component';

describe('ProBoardProjectsProjectComponent', () => {
  let component: ProProjectComponent;
  let fixture: ComponentFixture<ProProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
