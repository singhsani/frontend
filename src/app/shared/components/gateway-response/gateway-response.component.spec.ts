import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayResponseComponent } from './gateway-response.component';

describe('GatewayResponseComponent', () => {
  let component: GatewayResponseComponent;
  let fixture: ComponentFixture<GatewayResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
