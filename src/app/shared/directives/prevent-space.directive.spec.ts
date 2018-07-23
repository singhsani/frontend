import { PreventSpaceDirective } from './prevent-space.directive';
import { Directive, HostListener, HostBinding, ElementRef, Input } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

describe('PreventSpaceDirective', () => {
  let elementRef: ElementRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreventSpaceDirective
      ]
    })
  })
  it('should create an instance', () => {
    const directive = new PreventSpaceDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
