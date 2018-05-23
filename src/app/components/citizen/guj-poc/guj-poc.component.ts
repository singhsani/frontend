import { Component, OnInit } from '@angular/core';
declare var pramukhIME;

@Component({
	selector: 'app-guj-poc',
	templateUrl: './guj-poc.component.html',
	styleUrls: ['./guj-poc.component.scss']
})
export class GujPocComponent implements OnInit {

	testGuj: string;
	testEng: string;

	constructor() { }

	ngOnInit() {
	}

	converToGuj() {
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.testGuj = pramukhIME.convert(this.testEng);
	}

	converToSelf() {
		pramukhIME.resetSettings();
		let test = pramukhIME.convert(this.testGuj);
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.testGuj = pramukhIME.convert(test);
	}

}
