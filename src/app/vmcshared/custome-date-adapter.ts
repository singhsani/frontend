import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from "@angular/material";


export class CustomeDateAdapter extends NativeDateAdapter {


    parse(value: any): Date | null {
        console.log('a', value);
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            //   const str = value.split('/');
            //   const year = Number(str[2]);
            //   const month = Number(str[1]) - 1;
            //   const date = Number(str[0]);

            const str = value.replace(/\//g, '');
            if (str.length == 8) {
                const date = Number(str.substring(0, 2));
                const month = Number(str.substring(2, 4)) - 1;
                const year = Number(str.substring(4, 8));

                return new Date(year, month, date);
            }
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
       // return isNaN(timestamp) ? new Date() : new Date(timestamp);
       
    }
    format(date: Date, displayFormat: string): string {
        console.log('b', date);
        console.log('c', displayFormat);
        if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else if (displayFormat == "inputMonth") {
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(month) + '/' + year;
        } else {
            return date.toDateString();
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}


export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
        // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
        dateInput: 'input',
        // monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
        monthYearLabel: 'inputMonth',
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
}