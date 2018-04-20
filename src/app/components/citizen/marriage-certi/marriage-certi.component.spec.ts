import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageCertiComponent } from './marriage-certi.component';

describe('MarriageCertiComponent', () => {
  let component: MarriageCertiComponent;
  let fixture: ComponentFixture<MarriageCertiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarriageCertiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarriageCertiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
