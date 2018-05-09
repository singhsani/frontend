import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishNewComponent } from './mutton-fish-new.component';

describe('MuttonFishNewComponent', () => {
  let component: MuttonFishNewComponent;
  let fixture: ComponentFixture<MuttonFishNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuttonFishNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuttonFishNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
