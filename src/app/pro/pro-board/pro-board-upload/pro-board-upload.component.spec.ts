import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBoardUploadComponent } from './pro-board-upload.component';

describe('ProBoardUploadComponent', () => {
  let component: ProBoardUploadComponent;
  let fixture: ComponentFixture<ProBoardUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProBoardUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBoardUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
