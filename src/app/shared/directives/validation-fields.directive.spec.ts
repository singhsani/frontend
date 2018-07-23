import { ValidationFieldsDirective } from './validation-fields.directive';
import { Directive, HostListener, HostBinding, ElementRef, Input } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';


describe('ValidationFieldsDirective', () => {
  let elementRef: ElementRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidationFieldsDirective
      ]
    })
  })
  it('should create an instance', () => {
    const directive = new ValidationFieldsDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
