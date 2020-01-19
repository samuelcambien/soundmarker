import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProInfoComponent } from '../../public-info.component';

describe('ProInfoComponent', () => {
  let component: ProInfoComponent;
  let fixture: ComponentFixture<ProInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
