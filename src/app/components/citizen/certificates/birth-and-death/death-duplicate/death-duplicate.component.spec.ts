import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathDuplicateComponent } from './death-duplicate.component';

describe('DeathDuplicateComponent', () => {
  let component: DeathDuplicateComponent;
  let fixture: ComponentFixture<DeathDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeathDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeathDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
