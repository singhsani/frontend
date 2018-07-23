import { InputTrimDirective } from './input-trim.directive';
import {
  Directive, ElementRef,InjectionToken, HostListener, Inject, Input, Optional,
  Renderer2
} from '@angular/core';
import { COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

describe('InputTrimDirective', () => {
  it('should create an instance', () => {
    let renderer : Renderer2;
    let elementRef: ElementRef<any>;
    const directive = new InputTrimDirective(renderer, elementRef, this.COMPOSITION_BUFFER_MODE);
    expect(directive).toBeTruthy();
  });
});
