import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageConnNewComponent } from './drainage-conn-new.component';

 describe('DrainageConnNewComponent', () => {
  let component: DrainageConnNewComponent;
  let fixture: ComponentFixture<DrainageConnNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageConnNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageConnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
