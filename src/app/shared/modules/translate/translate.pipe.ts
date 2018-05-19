import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
	name: 'translate',
	pure: false
})
export class TranslatePipe implements PipeTransform {

	constructor(
		private translateService: TranslateService
	) { }

	transform(value: string, args?: string, lang?: string): string {

		if(args){
			return this.translateService.translate(value, args, lang);
		} else {

		}
	}

}
