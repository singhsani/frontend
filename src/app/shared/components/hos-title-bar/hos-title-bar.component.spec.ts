import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HosTitleBarComponent } from './hos-title-bar.component';
import { MaterialModule } from '../../modules/material/material.module';

describe('Shared : HosTitleBarComponent', () => {
  let component: HosTitleBarComponent;
  let fixture: ComponentFixture<HosTitleBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule],
      declarations: [ HosTitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
