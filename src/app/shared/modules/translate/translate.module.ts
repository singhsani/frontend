import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

const COMPONENTS = [
	TranslatePipe
]

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		...COMPONENTS
	],
	exports: [
		...COMPONENTS
	],
	providers: [
		TranslateService
	]
})
export class TranslateModule { }
