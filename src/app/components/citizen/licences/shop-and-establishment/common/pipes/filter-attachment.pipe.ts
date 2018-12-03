import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterAttachment'
})
export class FilterAttachmentPipe implements PipeTransform {

	transform(attachmentArray: any, category: string): any {
		let documentFilesArray = [];
		if (category) {
			attachmentArray.forEach((value) => {
				if (value.dependentFieldName == null) {
					documentFilesArray.push(value);
				}

				if (value.dependentFieldName) {
					let dependentFieldArray = value.dependentFieldName.split(",");
					if (dependentFieldArray.includes(category)) {
						documentFilesArray.push(value);
					}
				}
			});
		}
		return documentFilesArray;
	}
}
