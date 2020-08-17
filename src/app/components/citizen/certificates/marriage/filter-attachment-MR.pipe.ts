import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterAttachmentMR'
})
export class FilterAttachmentMRPipe implements PipeTransform {

	transform(attachmentArray: any, category: any): any {

		let documentFilesArray = [];
		if (category) {
			attachmentArray.forEach((value) => {
				if (value.dependentFieldName == null) {
					documentFilesArray.push(value);
				}

				else {
					let dependentFieldArray = value.dependentFieldName;
					if(category[0] == 'HINDU'){
						if (dependentFieldArray.includes('HINDU')) {
							documentFilesArray.push(value);
						}
					}
					if (category[2] == true && dependentFieldArray.includes('isBrideVisa')) {
						documentFilesArray.push(value);
					}
					if (category[1] == true && dependentFieldArray.includes('isGroomVisa')) {
						documentFilesArray.push(value);
					}
				}
			});
		}
		return documentFilesArray;
	}
}
