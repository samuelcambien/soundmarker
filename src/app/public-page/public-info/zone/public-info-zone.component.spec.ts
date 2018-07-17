import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInfoZoneComponent } from './public-info-zone.component';

describe('PublicInfoZoneComponent', () => {
  let component: PublicInfoZoneComponent;
  let fixture: ComponentFixture<PublicInfoZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInfoZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInfoZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
