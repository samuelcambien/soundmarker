import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPagenotfoundPageComponent } from './public-pagenotfound-page.component';

describe('PublicPagenotfoundPageComponent', () => {
  let component: PublicPagenotfoundPageComponent;
  let fixture: ComponentFixture<PublicPagenotfoundPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPagenotfoundPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPagenotfoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
