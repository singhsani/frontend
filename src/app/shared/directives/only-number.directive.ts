import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {
	@Input() OnlyYear: boolean = false;

	constructor(private el: ElementRef) { }

	@HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
		/* 
			8 -  for backspace
			9 -  for tab
			13 - for enter
			27 - for escape
			46 - for delete
		*/
		this.el.nativeElement.setAttribute("type", "number");
	
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
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	}

	@HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
		this.validateFields(event);
	}

	@HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
		this.validateFields(event);
	}

	//Todo For limit Parse Int
	validateFields(event) {
		setTimeout(() => {
			let numberRegEx = /^[0-9]+$/;
			if(this.OnlyYear){
				let curVal = parseInt(this.el.nativeElement.value);
				if (!numberRegEx.test(this.el.nativeElement.value) || curVal > (new Date().getFullYear()) || ((curVal.toString().length == 4) && ((new Date().getFullYear()) - 100) > curVal )) {
					this.el.nativeElement.value = "";
					event.preventDefault();
				}
			} else {
				if (!numberRegEx.test(this.el.nativeElement.value)) {
					this.el.nativeElement.value = "";
					event.preventDefault();
				}	
			}
			

			/* let checkNumber = (this.el.nativeElement.value);
			if (!isNaN(checkNumber)) {
				this.el.nativeElement.value = checkNumber;
				event.preventDefault();
			}else{
				this.el.nativeElement.value = "";
				event.preventDefault();
			} */
		}, 100)
	}
}