import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardCardComponent } from './pro-board-card.component';

describe('ProBoardCardComponent', () => {
  let component: ProBoardCardComponent;
  let fixture: ComponentFixture<ProBoardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
