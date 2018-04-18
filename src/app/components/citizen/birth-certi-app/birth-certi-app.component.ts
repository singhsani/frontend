import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-birth-certi-app',
	templateUrl: './birth-certi-app.component.html',
	styleUrls: ['./birth-certi-app.component.scss']
})
export class BirthCertiAppComponent implements OnInit {

	appId: number;
	birthCertForm: FormGroup;

	constructor(private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService, private fb: FormBuilder) {

		this.birthCertForm = fb.group({
			age: [null],
			fileStatus: [null],
			gender: [null]
		});

	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getBirthCertData();
	}

	/**
	 * This method use for get the citizen data
	 */
	getBirthCertData() {
		this.formService.apiType = 'birthCert';
		this.formService.getFormData(this.appId).subscribe(res => {

			this.birthCertForm.setValue({
				age: res.age,
				fileStatus: res.fileStatus,
				gender: res.gender == null ? 'MALE' : res.gender
			});
		});
	}

	/**
	 * This method is use to update citizen data
	 * @param value - form value
	 */
	onSubmit(value) {
		value.id = this.appId;
		this.formService.saveFormData(value).subscribe(res => {

			this.router.navigate(['/citizen/dashboard']);
		})
	}

}
