import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterAttachmentMF'
})
export class FilterAttachmentMFPipe implements PipeTransform {
  transform(attachmentArray: any, status: string): any {
    if (!status) {
      return attachmentArray;
    }

    let documentFilesArray = [];
    if (status) {
      attachmentArray.forEach((value) => {
        if (value.dependentFieldName == null) {
          documentFilesArray.push(value);
        }

        if (value.dependentFieldName) {
          let dependentFieldArray = value.dependentFieldName.split(",");
          if (dependentFieldArray.includes(status)) {
            documentFilesArray.push(value);
          }
        }
      });
    }
    return documentFilesArray;
  }

}