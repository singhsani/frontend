import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { OnlyDecimalDirective } from './only-decimal.directive';

describe('OnlyDecimalDirective', () => {

	let elementRef: ElementRef;

	beforeEach(() =>{
		TestBed.configureTestingModule({
			declarations: [OnlyDecimalDirective]
		})
	})

	it('should create an instance', () => {
		const directive = new OnlyDecimalDirective(elementRef);
		expect(directive).toBeTruthy();
	});
});
