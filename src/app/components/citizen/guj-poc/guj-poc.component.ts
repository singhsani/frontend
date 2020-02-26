import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-guj-poc',
	templateUrl: './guj-poc.component.html',
	styleUrls: ['./guj-poc.component.scss']
})
export class GujPocComponent implements OnInit {

	formGroup: FormGroup;

	constructor(
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.formGroup = this.fb.group({
			sourceGuj: '',
			targetGuj: '',
			sourceGujA: '',
			targetGujA: ''
		});
	}
}
