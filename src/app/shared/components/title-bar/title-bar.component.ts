import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-title-bar',
	template: `<mat-card class="cardH1">
					<h1>{{title}}</h1>
				</mat-card>`,
	styles: [` `]
})
export class TitleBarComponent implements OnInit {

	@Input()title: string;

	constructor() { }

	ngOnInit() {
	}

}
