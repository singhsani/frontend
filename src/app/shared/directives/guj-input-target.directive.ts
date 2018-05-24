import { Directive, ElementRef, HostListener } from '@angular/core';
declare var pramukhIME;

@Directive({
	selector: '[appGujInputTarget]'
})
export class GujInputTargetDirective {
	inputElement: HTMLInputElement;

	constructor(
		private elementRef: ElementRef
	) {
		this.inputElement = elementRef.nativeElement;
	}

	@HostListener('change')
	private change() {
		pramukhIME.resetSettings();
		let sourceGjValue = this.inputElement.value;
		let enValue = pramukhIME.convert(sourceGjValue);
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.inputElement.value = pramukhIME.convert(enValue);
	}

}
