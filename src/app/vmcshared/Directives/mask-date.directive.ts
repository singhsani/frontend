import { Directive, ElementRef, OnDestroy, HostListener } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[mask-date]'
})
export class MaskDateDirective implements OnDestroy {
  
  mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy
  maskedInputController;
  
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
      guide: false,
      keepCharPositions: false,
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
    let current: string = this.element.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && String(next).length > 10 ) {
      event.preventDefault(); 
    }
  }

}

// guide: true,
// placeholderChar: '_',
// pipe: undefined,
// keepCharPositions: false,
// showMask:false