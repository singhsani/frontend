import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPecPrcReceiptComponent } from './view-pec-prc-receipt.component';

describe('ViewPecPrcReceiptComponent', () => {
  let component: ViewPecPrcReceiptComponent;
  let fixture: ComponentFixture<ViewPecPrcReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPecPrcReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPecPrcReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
