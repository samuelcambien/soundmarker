import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSearchResultsComponent } from './pro-search-results.component';

describe('ProSearchResultsComponent', () => {
  let component: ProSearchResultsComponent;
  let fixture: ComponentFixture<ProSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
