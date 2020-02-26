import { PaginationService } from "../../../core/services/citizen/data-services/pagination.service";
import { CitizenConfig } from "../citizen-config";

export class CertificateConfig extends CitizenConfig {
    constructor(public paginationService?: PaginationService) {
        super(paginationService);
    }
}
