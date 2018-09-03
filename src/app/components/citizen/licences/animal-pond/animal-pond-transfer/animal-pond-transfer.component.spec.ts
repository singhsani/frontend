import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondTransferComponent } from './animal-pond-transfer.component';

describe('AnimalPondTransferComponent', () => {
  let component: AnimalPondTransferComponent;
  let fixture: ComponentFixture<AnimalPondTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalPondTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPondTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
