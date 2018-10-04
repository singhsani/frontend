import { Directive, HostListener, HostBinding, ElementRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var pramukhIME;
declare var PramukhIndic;

@Directive({
	selector: '[appGujInputSource]'
})
export class GujInputSourceDirective {
	@Input('targetElement') targetId: string;
	@Input('form') fg: FormGroup;
	inputElement: HTMLInputElement;

	constructor(public elementRef: ElementRef) {
		this.inputElement = elementRef.nativeElement;
	}

	@HostListener('change')
	private change() {
		let sourceEnValue = this.inputElement.value;
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.fg.get(this.targetId).setValue(pramukhIME.convert(sourceEnValue));
	}
}
