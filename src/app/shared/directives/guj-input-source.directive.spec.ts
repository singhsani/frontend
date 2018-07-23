import { GujInputSourceDirective } from './guj-input-source.directive';
import { Directive, HostListener, HostBinding, ElementRef, Input } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
declare var pramukhIME;
declare var PramukhIndic;

describe('GujInputSourceDirective', () => {

  let elementRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GujInputSourceDirective]
    });
  })
  it('should create an instance', () => {
    const directive = new GujInputSourceDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
