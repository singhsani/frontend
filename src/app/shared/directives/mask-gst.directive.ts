import { Directive, OnDestroy, HostListener, ElementRef } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';
@Directive({
  selector: '[appGst]'
})
export class GstDirective {

  //mask = [/[0-9]/, /[0-9]/, '-', /\d/, /\d/, '-', /[a-zA-Z]/, /[a-zA-Z]/, '-', /\d/, /\d/, /\d/, /\d/];
  mask = [/\d/, /\d/, /[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, /\d/, /\d/, /\d/, /\d/, /[a-zA-Z]/, /\d/, /[zZ]/, /\d/];
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
    if (next && String(next).length > 16) {
      event.preventDefault();
    }
  }

}
