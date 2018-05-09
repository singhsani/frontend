import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillBirthComponent } from './still-birth.component';

describe('StillBirthComponent', () => {
  let component: StillBirthComponent;
  let fixture: ComponentFixture<StillBirthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StillBirthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillBirthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
