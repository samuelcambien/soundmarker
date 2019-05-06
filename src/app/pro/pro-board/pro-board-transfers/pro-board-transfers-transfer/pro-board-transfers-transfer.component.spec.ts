import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardTransfersTransferComponent } from './pro-board-transfers-transfer.component';

describe('ProBoardTransfersTransferComponent', () => {
  let component: ProBoardTransfersTransferComponent;
  let fixture: ComponentFixture<ProBoardTransfersTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardTransfersTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardTransfersTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
