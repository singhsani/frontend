import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterConnNewComponent } from './water-conn-new.component';

 describe('WaterConnNewComponent', () => {
  let component: WaterConnNewComponent;
  let fixture: ComponentFixture<WaterConnNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterConnNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterConnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
