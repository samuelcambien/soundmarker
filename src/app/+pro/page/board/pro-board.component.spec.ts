import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardComponent } from './pro-board.component';

describe('ProBoardComponent', () => {
  let component: ProBoardComponent;
  let fixture: ComponentFixture<ProBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
