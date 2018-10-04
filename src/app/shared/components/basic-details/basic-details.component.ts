import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-basic-details',
	templateUrl: './basic-details.component.html',
	styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {

	@Input() basicFormGroup: FormGroup;

	translateKey: string = 'basicDetailsScreen';

	constructor() {
	}

	ngOnInit() {
		
	}

}
