import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAttachment'
})
export class FilterAttachmentPipe implements PipeTransform {

  transform(attachmentArray: any, category:string): any {
    let data:Array<any>=[];
    if(category){
      
      switch(category){
        case 'SHOP_LIC_TRUST':
        case 'SHOP_LIC_BOARD':
          data= attachmentArray.filter((obj)=>obj.category==="SHOP_LIC_TRUST" || obj.category==="common");
        break;

        case 'SHOP_LIC_PARTNERSHIP':
        case 'SHOP_LIC_CO_OPERATIVE_SOCIETY':
          data= attachmentArray.filter((obj)=>obj.category==="SHOP_LIC_PARTNERSHIP" || obj.category==="common");
        break;

        default:
          data= attachmentArray.filter((obj)=>obj.category===category || obj.category==="common");   
        break;
      }
      return data;
    }else{
      return attachmentArray;
    }
    
  }

}
