import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
	name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

	transform(value: any, args: any): any {

		if (args != "") {
		  var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
		  return value.replace(re, '<span class="bg-info text-white">' + args + '</span>');
		}else{
		  return value;
		}

	}

}
