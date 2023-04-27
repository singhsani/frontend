import { VMCConfiguation } from './vmc.config'

export class Constants {

    // Base URL for API
    static searchBaseUrl = VMCConfiguation.searchBaseUrl;
    static serverApiIp = VMCConfiguation.serverApiIp;
    static baseApiUrl = Constants.serverApiIp + '/master/';
    static baseApiPropertyUrl = Constants.baseApiUrl + 'property/';
    static baseApiWaterUrl = Constants.serverApiIp + '/water/';
    static messageApiUrl = Constants.serverApiIp + '/message/';
    static assessmentModuleApiUrl = Constants.serverApiIp + '/property/';
    static commonApiUrl = Constants.serverApiIp + '/';

    static BaseUrl = '';
    static userModuleCode = '';
    static propertyTaxModuleCode = 'M-1001';
    static currentModule = "1";
    static atATimeText: string;
    static selectedText: string;
    static totalText: string;
    static deleteConfirmationText: string;
    static serverErrorText: string;
    static deleteCompanyAssociatedMessage: string;
    static deleteSuccessMessage: string;
    static butText: string;
    static ConfirmPasswordText: string;
    static alertmessage: string;
    static validationMessage: string;
    static selectAll: string;
    static unselectAll: string;
    static selectUser: string;
    static selectDays: string;
    static select: string;
    static activeUsers: string;
    static inactiveUsers: string;
    static userGroups: string;
    static passwordPolicy: string;
    static invalidPassword: string;
    static requiredValid: string;
    static tableViewtext: string;
    static msgText: string;
    static confirmationModalTitle: string;
    static confirmationModalBody: string;
    static deleteConfirmationModalBody: string;
    static OkText: string;
    static CancelText: string;
    static btnCancelText: string;
    static propertyTaxModuleApiBaseUrl: string;
    static propertyBillTypeIdSelected: string = "NORMAL";
    static pageSize: number = 5;
    static pageRecord: Array<number> = [5,25,100];
    static rupeeSymbol = "₹";

    static LookupCodes = {
        Water_Within_Limit: "WATER_WITHIN_LIMIT",
        Meter_Status: "METER_STATUS",
        Connection_Type: "CNTY",
        Property_Tax_Type: "PROPERTY_TAXTYPE",
        Water_Zone: "WATER_ZONE",
        High_Low_Rise: "HIGH_LOW_RISE",
        Value_Type: "TAX_VAL_TYPE",
        Calculation_Operation_Type: "CAL_OPER_TYPE",
        Meter_Ownership: "METER_OWNERSHIP",

        Water_Service_Name: "WATER_SERVICE_NAME",
        Water_Service_Charge: "WATER_SERVICE_CHARGE",
        Property_Service_Name: "PROPERTY_SERVICE_NAME",
        Property_Service_Charge: "PROPERTY_SERVICE_CHARGE",
        Tax_Applicable_At: "TAX_APPLICABLE_AT",
        Rebate_Applicable_At: "REBATE_APPLICABLE_AT",
        Road_Type: "ROAD_TYPE",
        Calculation_On: "CALCULATION_ON",
        Gender: "GENDER",
        Active_Status: "STATUS",
        Factor_Name: "FACTOR_NAME",
        Rebate_Type: "REBATE_TYPE",
        Condition: "REBATE_CONDITION",
        Amount_Deduct_From: "AMOUNT_DEDUCT_FROM",
        Water_Tax_Type: "WATER_TAXTYPE",
        Water_Tax_Name: "WATER_TAX_NAME",
        Calculation_Period_Applicable_Date: "CAL_PERIOD_APPLICABLE_DATE",
        Water_Tax_Base: "WATER_TAX_BASE",
        Meter_Restore_Type: "METER_RESTORE_TYPE",
        Objection_On: "OJBON",
        Asset_Type: "ASSETTYPE",
        Asset_Condition: "ASSETCONDITION",
        License_For: "LICENSE_FOR",
        Education_Qualification: "EDUCATION_QUALIFICATION",

        SR_Property_Slab_Depend_On: "SR_PROPERTY_SLAB_DEPEND_ON",
        SR_Water_Slab_Depend_On: "SR_WATER_SLAB_DEPEND_ON",
        Property_Slab_Depend_On: "PROPERTY_SLAB_DEPEND_ON",
        Water_Slab_Depend_On: "WATER_SLAB_DEPEND_ON",
        TR_Property_Slab_Depend_On: "TR_PROPERTY_SLAB_DEPEND_ON",
        Paymode_Mode: "PAYMENT_MODE",

        Transfer_SubType: "OTHER_TRANSFER_SUBTYPE",
        Transfer_Type: "TRANSFER_TYPE",
        Floor_No: "UNIT_DETAILS_FLOOR_NO",
        Title: "title",
        TRANSFER_TITLE: "TRANSFER_TITLE",
        Disconnection_Type: "DISCONN_TYPE",
        Reason_for_Disconnection: "DISCONN_REASON",
        Document_Type: "DOCUMENT",
        Property_Bill_Type: "PROPERTY_BILL_TYPE",
        Water_Transfer_Reason: "WATER_TRANSFER_REASON",
        Reason_For_Reassessment: "REASON_FOR_REASSESSMENT",
        Room_Type: "ROOM_TYPE",
        Room_Type_New:"ROOM_TYPE_NEW",
        History_Transaction_Type: 'HISTORY_TRANSACTION_TYPE',
        Collection_Payment_Of: "COLLECTION_PAYMET_OF",
        Action_on_Vacancy_Amount: "ACTION_ON_VACANCY_AMOUNT",
        Demamd_Type: 'DEMAND_TYPE',
        Register_Search_Property_Status: 'REGISTER_SEARCH_PROPERTY_STATUS',
        Operators: 'Operators',
        Property_Rebate_Slab_Depend_On: 'PROPERTY_REBATE_SLAB_DEPEND_ON',
        Property_Hearing_Venue_Type: 'PROPERTY_HEARING_VENUE_TYPE',
        Property_On_VMC_Address: 'HEARING_ON_VMC_ADDRESS',
        Property_Defaulter_Type:'PROPERTY_DEFAULTER_TYPE',
        Property_sub_Reason_For_Creation: 'SUB_REASON_FOR_CREATION',
        OCCUPIER_CODE: "OCCUPIER_CODE"
    };

    static ItemCodes = {
        Meter: "MTR",
        Fix: "FIX",
        Slab: "SLAB",
        Recur_Slab: "RECUR_SLAB",
        With_In_Limit: "WITH_IN_LIMIT",
        Out_of_Limit: "OUT_OF_LIMIT",
        // Meter Status
        Meter_Working: "MWK",
        House_Lock: "HLK",
        Bad_Not_Working_Theft_Tempered: "MNWK",
        Meter_Restore: "RESTORE",
        Meter_Disconnect: "DISCONN",
        //
        Meter_Owner_Consumer: "MTR_OWNER_CONSUMER",

        Payment_Mode_Cash: "PAYMENT_MODE_CASH",
        Payment_Mode_Cheque: "PAYMENT_MODE_CHEQUE",
        Payment_Mode_Demand_Draft: "PAYMENT_MODE_DEMAND_DRAFT",
        Payment_Mode_Credit_Debit_Card: "PAYMENT_MODE_CREDIT_DEBIT_CARD",
        Payment_Mode_Direct_Bank: "PAYMENT_MODE_DIRECT_BANK",
        Property_History: "PROPERTY_HISTORY",
        Bill_Reciept_Detail: "BILL_&_RECIEPT_DETAIL",
        License_Water: "LICENSE_WATER",
        License_Drainge: "LICENSE_DRAINAGE",
        New_System: "NEW_SYSTEM",
        Old_System: "OLD_SYSTEM",
        Both: "BOTH",
        Adjust_in_next_bill: "ADJUST_IN_NEXT_BILL",
        Refund: "VACANCY_REFUND",
        Hearing_On_Property_Address: "HEARING_ON_PROPERTY_ADDRESS",
        Hearing_On_VMC_Address: "HEARING_ON_VMC_ADDRESS",
        DataEntry: "DATAENTRY",
        DEPARTMENT: "DEPARTMENT",
        Application: "APPLICATION",
        New: "NEW",
        Objection:"OBJECTION"
    };

    static ModuleId = {
        Property_Tax: "1",
        Water_Tax: "2",
    };

    static ModuleKey = {
        Property_Tax: "PROPERTYTAX",
        Water_Tax: "WATERTAX",
    };

    static YesNoKey = { Yes: "Yes", No: "No" };
    static YesNoValue = [{ itemId: true, itemName: "Yes" }, { itemId: false, itemName: "No" }];
    static ActiveInactiveKey = { Active: "Active", Inactive: "Inactive" };
    static ActiveInactiveValue = [{ itemId: true, itemName: "Active" }, { itemId: false, itemName: "Inactive" }];

    static DateFormat = { DDMMYYYY: "dd/MM/yyyy" };

    static Payment_From_Option = {
        Extract_Property: "EXTRACT_PROPERTY",
        No_Due_Certificate: "NO_DUE_CERTIFICATE",
        Duplicate_Bill: "DUPLICATE_BILL",
        Assessment_Certificate: "ASSESSMENT_CERTIFICATE",
        Property_Collection: "PROPERTY_COLLECTION",
        Water_Collection: "WATER_COLLECTION",
        LOI_COLLECTION: "LOI_COLLECTION",
        Vacant_Premises_Certificate : "VACANT_PREMISES_CERTIFICATE",
    };

    static Register_Type = {
        Demand: "DEMAND",
        Collecion: "COLLECTION",
        Closing_Details: "CLOSING_DETAILS",
        Closing_Summary: "CLOSING_SUMMARY",
        Assessment: "ASSESSMENT",
        Advance_Payment:"ADVANCE_PAYMENT",
        Objection_Hearing:"OBJECTION_HEARING",
        Connection_Register:"CONNECTION_REGISTER"
    };

    static Create_Formula_Open_From = {
        Tax_Rate_Definition_Define: "TAX_RATE_DEFINITION_DEFINE"
    };

    static errorMessage = {
        dateFormateHint: 'Hint:DD/MM/YYYY',
        dateFormateErrorMsg: '*Invalid date format.',
        noDateFound: 'No data found!'
    }

    static loiApprovalStatus = {
        Approved: 'Approved By newgen',
        In_Progress: 'In Progress',
        Reject: 'Rejected by newgen',
        Rejection_Letter_Generated: 'Rejection Letter Generated',
        LOI_Generated: 'LOI Generated'
    }

    static exportTypes = {
        PDF: "PDF",
        XLSX: "XLSX",
    };

}


export const DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MM YYYY',
    },
};
