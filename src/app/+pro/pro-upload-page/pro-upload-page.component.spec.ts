import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PublicUploadPageComponent} from '../../+public/public-upload-page/public-upload-page.component';

describe('ProUploadPageComponent', () => {
  let component: PublicUploadPageComponent;
  let fixture: ComponentFixture<PublicUploadPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUploadPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
