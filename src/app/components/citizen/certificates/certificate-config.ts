import { ComponentConfig } from "../../component-config";
import { PaginationService } from "../../../core/services/citizen/data-services/pagination.service";
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

export class CertificateConfig extends ComponentConfig {
    public paginationService: PaginationService
    
    constructor() {
        super();
    }
    /**
	 * This method use to get all the citizen data with pagination.
	 */
    getAllData(form, sort, paginator, pageSize, apiType) {
        return merge(sort.sortChange, paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.paginationService.apiType = apiType;
                    this.paginationService.pageIndex = (paginator.pageIndex + 1);
                    this.paginationService.pageSize = pageSize;
                    return this.paginationService!.getSearchDataWithPagination(form.value);
                }),
                map(data => {
                    return data;
                }),
                catchError(() => {
                    return observableOf([]);
                })
            )
    }
}
