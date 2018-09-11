import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlayerListComponent } from './public-player-list.component';

describe('PublicPlayerListComponent', () => {
  let component: PublicPlayerListComponent;
  let fixture: ComponentFixture<PublicPlayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPlayerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
