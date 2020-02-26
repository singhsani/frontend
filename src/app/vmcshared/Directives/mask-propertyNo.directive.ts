import { Directive, ElementRef, OnDestroy, HostListener } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[mask-property-no]'
})
export class MaskPropertyNoDirective implements OnDestroy {
  
  mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/ , /\d/, /\d/, /\d/]; // ##-##-######
  maskedInputController;
  
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
      guide: false,
      placeholderChar: '_',
      keepCharPositions: true,
      showMask:true
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
    this.element.nativeElement.focus();
    let current: string = this.element.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && String(next).length > 17 ) {
      event.preventDefault(); 
    }
  }

  /*
  @HostListener('click', ['$event'])
  click(event: KeyboardEvent) {
    let l = this.element.nativeElement.value.length;
    this.element.nativeElement.setSelectionRange(l,l);
    this.element.nativeElement.focus()
  }*/

}

// guide: true,
// placeholderChar: '_',
// pipe: undefined,
// keepCharPositions: false,
// showMask:false