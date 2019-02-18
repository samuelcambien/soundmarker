import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardTransfersComponent } from './pro-board-transfers.component';

describe('ProBoardTransfersComponent', () => {
  let component: ProBoardTransfersComponent;
  let fixture: ComponentFixture<ProBoardTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
