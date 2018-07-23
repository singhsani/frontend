import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var pramukhIME;
declare var PramukhIndic;


@Directive({
	selector: '[appGujInputTarget]'
})
export class GujInputTargetDirective {
	inputElement: HTMLInputElement;
	@Input('form') fg: FormGroup;
	@Input('formControlName') fcn: string;
	
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
		this.fg.get(this.fcn).setValue(pramukhIME.convert(enValue));
	}

}
