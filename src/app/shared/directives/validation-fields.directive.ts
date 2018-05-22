import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidationFields]'
})
export class ValidationFieldsDirective {

  @Input() validationFieldsType: string;

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event) {

    let e = <KeyboardEvent>event;
		/* 
			8 -  for backspace
			9 -  for tab
			13 - for enter
			27 - for escape
			46 - for delete
		*/


    switch (this.validationFieldsType) {
      
      case "onlyNameWithOutSpace":
        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
          return;
        }
        if ((e.keyCode === 32  || (e.keyCode < 65 || e.keyCode > 96))) {
          e.preventDefault();
        }
        break;

      case "onlyNameWithSpace":
        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
          return;
        }
        if (e.keyCode != 32 && ((e.keyCode < 65 || e.keyCode > 96))) {
          e.preventDefault();
        }
        break;

      default:
        break;
    }
  }

  @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
    this.validateFields(event);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      switch (this.validationFieldsType) {
        case "onlyNameWithOutSpace":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
          event.preventDefault();
          break;

        case "onlyNameWithSpace":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '')
          event.preventDefault();
          break;

        default:
          break;
      }
    }, 100)
  }

}
