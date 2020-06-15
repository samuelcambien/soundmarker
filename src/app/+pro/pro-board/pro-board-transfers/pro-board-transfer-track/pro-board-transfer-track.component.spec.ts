import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardTransferTrackComponent } from './pro-board-transfer-track.component';

describe('ProBoardTransferTrackComponent', () => {
  let component: ProBoardTransferTrackComponent;
  let fixture: ComponentFixture<ProBoardTransferTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardTransferTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardTransferTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
