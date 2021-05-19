import { Directive, OnDestroy, HostListener, ElementRef } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[appMaskRegistrationNumVt]'
})
export class MaskRegistrationNumVtDirective {

  // mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  mask = [/[a-zA-Z]/, /[a-zA-Z]/,'-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskedInputController;

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
      guide: false,
      placeholderChar: '_',
      keepCharPositions: true,
      showMask: true
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.element.nativeElement.value;
    let next: string = current.concat(event.key);
    // if (next && String(next).length > 17) {
    //   event.preventDefault();
    // }
  }

}
