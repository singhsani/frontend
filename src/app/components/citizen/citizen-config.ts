import { ComponentConfig } from "../component-config";
import { PaginationService } from "../../core/services/citizen/data-services/pagination.service";
import { ToastrService } from 'ngx-toastr';

export class CitizenConfig extends ComponentConfig {
    constructor(public paginationService?:  PaginationService,
       public toastr?: ToastrService){
        super(paginationService, toastr);
    }
}
