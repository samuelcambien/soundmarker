import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInfoLinkComponent } from './public-info-header.component';

describe('PublicInfoLinkComponent', () => {
  let component: PublicInfoLinkComponent;
  let fixture: ComponentFixture<PublicInfoLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInfoLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInfoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
