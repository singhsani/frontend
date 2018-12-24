import { ComponentConfig } from "../../component-config";
import { PaginationService } from "../../../core/services/citizen/data-services/pagination.service";

export class CertificateConfig extends ComponentConfig {
    constructor(public paginationService?: PaginationService) {
        super(paginationService);
    }
}
