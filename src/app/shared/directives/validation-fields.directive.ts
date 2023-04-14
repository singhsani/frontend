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
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }

        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }

        if ((e.keyCode === 32 || (e.keyCode < 65 || e.keyCode > 96))) {
          e.preventDefault();
        }
        break;

      case "onlyNameWithSpace":
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }

        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        if (e.keyCode != 32 && (e.keyCode < 65 || e.keyCode > 96)) {
          e.preventDefault();
        }
        break;

      case "alphanumericWithSpace":
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }

        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        if (e.keyCode != 32 && ((e.keyCode > 57 && e.keyCode < 48) || (e.keyCode > 105 && e.keyCode > 96))) {
          e.preventDefault();
        }
        break;

        case "appAlphanumericNumberWithDashAndComa":
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }

        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }

        
        break; 

      case "appAddressAllowed":
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }
        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        if (e.keyCode != 189 && e.keyCode != 32 && e.keyCode != 188 && (e.keyCode < 65 || e.keyCode > 96) && (e.keyCode < 48 || e.keyCode > 57)) {
          e.preventDefault();
        }
        break;

      case "onlyPancard":
        // if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1) {
        //   return;
        // }

        if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+C
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+V
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          // Allow: Ctrl+X
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }

        if (e.keyCode === 32 && (e.keyCode < 65 || e.keyCode > 96) && (e.keyCode < 48 || e.keyCode > 57)) {
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

        case "alphanumericWithSpace":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9a-zA-Z\s]/g, '');
          event.preventDefault();
          break;

        case "appAlphanumericNumber":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z0-9]/g, '')
          event.preventDefault();
          break;

        case "appAlphanumericNumberWithSpace":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^ A-Za-z0-9]/g, '')
          event.preventDefault();
          break;

          case "appAlphanumericNumberWithDashAndComa":
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^_.()0-9a-zA-Z\s,-]+$/g, '')
            event.preventDefault();
            break;  

        case "appAddressAllowed":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^#.0-9a-zA-Z\s,-]+$/g, '')
          event.preventDefault();
          break;

        case "onlyPancard":
          this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^[A-Z]{5}\d{4}[A-Z]{1}$]/g, '');
          event.preventDefault();
          break;

        default:
          break;
      }
    }, 100)
  }

}
