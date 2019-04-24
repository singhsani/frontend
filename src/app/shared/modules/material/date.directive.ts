import { Directive, ElementRef, HostListener,Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appDate]'
})
export class DateDirective implements OnInit {

  @Input("min") min : any;

  constructor(private el: ElementRef, private r2: Renderer2) {

  }

  ngOnInit() {
    setTimeout(() => {
      // this.r2.setElementStyle(this.el.nativeElement, 'color', 'blue');
      // this.r2.setAttribute(this.el.nativeElement, 'placeholder', 'DD/MM/YYYY');
      this.r2.setAttribute(this.el.nativeElement, 'maxlength', '10');
      this.r2.setAttribute(this.el.nativeElement, 'minlength', '10');
    }, 100)
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
		/* 
			8 -  for backspace
			9 -  for tab
			13 - for enter
			27 - for escape
			46 - for delete
		*/
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
      (e.keyCode >= 35 && e.keyCode <= 39) || (e.keyCode == 191)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number or / and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) onkeyup(e: KeyboardEvent) {
    this.checker(e);
  }

  checker(e: KeyboardEvent){
    let numberRegEx = /^[0-9/]+$/;
    let val = String(this.el.nativeElement.value);

    if (!numberRegEx.test(this.el.nativeElement.value)) {
      this.el.nativeElement.value = "";
      e.preventDefault();
    } else if (val.length <= 10) {
      if (val.length == 2 && e.keyCode != 8) {
        this.el.nativeElement.value = this.el.nativeElement.value.concat("/");
      }
      if (val.length == 5 && e.keyCode != 8) {
        this.el.nativeElement.value = this.el.nativeElement.value.concat("/");
      }
    }
  }

}
