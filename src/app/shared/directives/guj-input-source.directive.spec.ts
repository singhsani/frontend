import { GujInputSourceDirective } from './guj-input-source.directive';
import { OnInit, Directive, HostListener, HostBinding, ElementRef, Input, Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { GujInputTargetDirective } from './guj-input-target.directive';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from "@angular/forms";
import { create } from 'domain';

declare var pramukhIME;
declare var PramukhIndic;


@Component({
  template: `
  <form [formGroup]="testForm">
    <input type="text" name="i1" [form]="testForm" formControlName="engControl" appGujInputSource targetElement="gujControl" >
    <input type="text" [form]="testForm" formControlName="gujControl" appGujInputTarget>
  </form>`
})
class TestEnglishToGujrati implements OnInit {
  testForm: FormGroup;
  constructor(public _fb: FormBuilder) { }
  ngOnInit() {
    this.createTestForm();
  }
  createTestForm() {
    this.testForm = this._fb.group({
      gujControl: [null],
      engControl: [null]
    })
  }
}

describe('Directive : GujInputSourceDirective', () => {

  let elementRef: ElementRef;
  let fixture: ComponentFixture<TestEnglishToGujrati>;
  let inputEl: DebugElement;
  let inputEl2: DebugElement;

  let component: TestEnglishToGujrati

  const createComponent = () => {
    fixture = TestBed.createComponent(TestEnglishToGujrati);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GujInputSourceDirective,
        TestEnglishToGujrati,
        GujInputTargetDirective]
    });
    createComponent();
  })

  afterEach(() => {
    component = null;
  })

  it('First Input Should English(test) and other should be (તેસ્ત)', () => {
    component.testForm = new FormGroup({
      gujControl: new FormControl(null),
      engControl: new FormControl('test')
    })
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.directive(GujInputSourceDirective));
    inputEl.triggerEventHandler('change', null);
    fixture.detectChanges();
    inputEl2 = fixture.debugElement.query(By.directive(GujInputTargetDirective));
    expect(inputEl2.nativeElement.value).toBe("તેસ્ત");
  });
});
