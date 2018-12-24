import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { PaginationService } from "../core/services/citizen/data-services/pagination.service";
import * as moment from 'moment';
import * as _ from 'lodash';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';


/**
 * Kindly extend this class for getting all utils and constants
 */
export class ComponentConfig {


    /**
     * Message Constants
     */
    ALL_FEILD_REQUIRED_MESSAGE = "Please fill all the required feilds";
    MOB_NO_MIS_MATCH_MESSAGE = "Mobile Number and Confirm Mobile Number should match";
    EMAIL_MIS_MATCH_MESSAGE = "Email and Confirm Email should match";

    /**
     * User Defined Date Array
     */
    public DateArray = [
        { month: 'Jan', id: '01', monthName: 'January' },
        { month: 'Fab', id: '02', monthName: 'February' },
        { month: 'Mar', id: '03', monthName: 'March' },
        { month: 'Apr', id: '04', monthName: 'April' },
        { month: 'May', id: '05', monthName: 'May' },
        { month: 'Jun', id: '06', monthName: 'June' },
        { month: 'Jul', id: '07', monthName: 'July' },
        { month: 'Aug', id: '08', monthName: 'August' },
        { month: 'Sep', id: '09', monthName: 'September' },
        { month: 'Oct', id: '10', monthName: 'October' },
        { month: 'Nov', id: '11', monthName: 'November' },
        { month: 'Dec', id: '12', monthName: 'December' },
    ];

    constructor(protected paginationService? : PaginationService) { }

    /**
	 * This Method for create attachment array in service detail
	 * @param data : value of array
	 */
    createDocumentsGrp(data?: any): FormGroup {
        return new FormBuilder().group({
            // dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
            documentIdentifier: new FormControl(data.documentIdentifier ? data.documentIdentifier : null),
            documentKey: [data.documentKey ? data.documentKey : null],
            documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
            documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
            fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
            formPart: [data.formPart ? data.formPart : null],
            id: [data.id ? data.id : null],
            isActive: [data.isActive],
            mandatory: [data.mandatory ? data.mandatory : false],
            maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
            requiredOnAdminPortal: [data.requiredOnAdminPortal],
            requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
            // version: [data.version ? data.version : null]
        });
    }

	/**
	 * Method is create required document array
	 */
    requiredDocumentList(form: FormGroup, uploadFilesArray: Array<any>) {
        _.forEach(form.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
            if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
                uploadFilesArray.push({
                    'labelName': value.documentLabelEn,
                    'fieldIdentifier': value.fieldIdentifier,
                    'documentIdentifier': value.documentIdentifier
                })
            }
        });
        //check for attachment is mandatory
        // this.dependentAttachment(this.provisionalNocForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
        // this.dependentAttachment(this.provisionalNocForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
    }

    /**
     * to return proper date
     */
    getProperErrorMessage(errorMessage: string): string {
        return errorMessage.split("_").join(" ");
    }

    /**
     * to get all errors with index count.
     * @param form pass form here
     */
    getAllErrors(form) {
        this.markAsTouched(form);
        let count = 0;
        for (const key in form.controls) {
            if (form.get(key).invalid) {
                break;
            }
            count++;
        }
        return count;
    }

    /**
     * To mark invalid for as touched
     * @param form pass form here
     */
    markAsTouched(form) {
        for (let controls in form.controls) {
            let control = form.get(controls)
            if (control instanceof FormControl) {
                control.markAsTouched();
                control.updateValueAndValidity();
            } else if (control instanceof FormGroup) {
                this.getAllErrors(control)
            } else if (control instanceof FormArray) {
                control.controls.forEach(c => {
                    if (c instanceof FormGroup) {
                        this.getAllErrors(c);
                    }
                });
            }
        }
    }

    /**
     * to get proper day
     * @param date - pass date
     */
    getDay(date: string): string {

        let Days: Array<any> = [
            { day: 'Sunday', code: 0 },
            { day: 'Monday', code: 1 },
            { day: 'Tuesday', code: 2 },
            { day: 'Wednesday', code: 3 },
            { day: 'Thursday', code: 4 },
            { day: 'Friday', code: 5 },
            { day: 'Saturday', code: 6 },
        ];

        return Days.find(day => day.code == moment(date).day()).day;
    }

    /**
	 * Method is used to return Date in format (DD-MM-YYYY)
	 * @param date - string date
	 */
    returnProperDate(date: string) {
        if (date) {
            let newDate = date.split(" ")[0].split("-");
            return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
        }
        return null;
    }

    /**
     * Method is used to match two cotrols of form.
     * @param form - form group
     * @param c1 - control 1
     * @param c2 - control 2
     */
    matcher(form: FormGroup, c1: string, c2: string): boolean {
        return form.get(c1).value == form.get(c2).value
    }

    /**
    * This method use to get all the citizen data with pagination.
    */
    getAllData(sort, paginator, pageSize, apiType, form?: FormGroup) {
        return merge(sort.sortChange, paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.paginationService.apiType = apiType;
                    this.paginationService.pageIndex = (paginator.pageIndex + 1);
                    this.paginationService.pageSize = paginator.pageSize;;
                    if(form){
                        return this.paginationService!.getSearchDataWithPagination(form.value);
                    }
                    return this.paginationService!.getAllData();
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