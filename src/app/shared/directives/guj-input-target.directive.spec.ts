import { GujInputTargetDirective } from './guj-input-target.directive';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Directive, HostListener, HostBinding, Input, ElementRef } from '@angular/core';

describe('GujInputTargetDirective', () => {
  let elementRef: ElementRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GujInputTargetDirective]
    });
  })
  
  it('should create an instance', () => {
    const directive = new GujInputTargetDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
