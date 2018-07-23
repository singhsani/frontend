import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HosActionBarComponent } from './hos-action-bar.component';
import { RouterTestingModule } from "@angular/router/testing";


describe('HosActionBarComponent', () => {
  let component: HosActionBarComponent;
  let fixture: ComponentFixture<HosActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosActionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
