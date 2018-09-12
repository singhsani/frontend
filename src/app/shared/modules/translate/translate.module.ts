import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translate.pipe';

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
	]
})
export class TranslateModule { }
