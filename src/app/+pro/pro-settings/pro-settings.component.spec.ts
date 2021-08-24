import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSettingsComponent } from './pro-settings.component';

describe('ProSettingsComponent', () => {
  let component: ProSettingsComponent;
  let fixture: ComponentFixture<ProSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
