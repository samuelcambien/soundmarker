import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInfoHeaderComponent } from './public-info-header.component';

describe('PublicInfoHeaderComponent', () => {
  let component: PublicInfoHeaderComponent;
  let fixture: ComponentFixture<PublicInfoHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInfoHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
