import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishCancellationComponent } from './mutton-fish-cancellation.component';

describe('MuttonFishCancellationComponent', () => {
  let component: MuttonFishCancellationComponent;
  let fixture: ComponentFixture<MuttonFishCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuttonFishCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuttonFishCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
