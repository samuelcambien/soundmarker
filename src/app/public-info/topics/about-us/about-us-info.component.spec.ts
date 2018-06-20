import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsInfoComponent } from '../../public-info.component';

describe('AboutUsInfoComponent', () => {
  let component: AboutUsInfoComponent;
  let fixture: ComponentFixture<AboutUsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
