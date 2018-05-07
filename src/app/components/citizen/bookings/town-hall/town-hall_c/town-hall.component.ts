import { Component, OnInit } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyLocales, IMyOptions } from 'mydatepicker/dist/interfaces';
import { Router } from '@angular/router';

@Component({
	selector: 'app-town-hall',
	templateUrl: './town-hall.component.html',
	styleUrls: ['./town-hall.component.scss']
})
export class TownHallComponent implements OnInit {
	displayedColumns = ['checkbox', 'position', 'name', 'weight', 'symbol'];
	tableData: Array<any> = [];

	constructor(
		private router: Router
	) {
	}
	private myDatePickerOptions: IMyDpOptions = {
		dateFormat: 'dd/mm/yyyy',
		selectorHeight: '280px',
		selectorWidth: '280px',
		inline: true,
		//firstDayOfWeek:'mo',
		//disableWeekends:true,
		//sunHighlight: false,
		//dayLabels: { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' },
		//monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' },
		//satHighlight: true,
		/* highlightDates: [{
			year: 2018,
			month: 4,
			day: 11
		}, {
			year: 2018,
			month: 4,
			day: 18
		}], */
		//markWeekends: { marked: true, color: 'green' },
		//disableWeekdays: ['sa'],
		/* disableDays: [{
			year: 2018,
			month: 4,
			day: 11
		}, {
			year: 2018,
			month: 4,
			day: 18
		}],  */
		/* disableUntil: { year: 2018, month: 6, day: 26 },
		disableSince: { year: 2018, month: 7, day: 22 }, */
		//yearSelector:false,
		/* minYear:1,
		maxYear: 10, */
		//disableDateRanges: [{ begin: { year: 2018, month: 4, day: 14 }, end: { year: 2018, month: 11, day: 20 } }],
		disableUntil: { year: 0, month: 0, day: 0 }
	};

	setFrLocale(lang) {
		let copy = this.getCopyOfOptions();
		if (lang == "gu") {
			copy.dayLabels = { su: "સૂર્ય", mo: "સોમ", tu: "મંગળ", we: "બુધ", th: "ગુરુ", fr: "શુક્ર", sa: "શનિ" };
			copy.monthLabels = { 1: "જાન", 2: "ફેવ", 3: "માર્ચ", 4: "એપ્રિલ", 5: "મે", 6: "જુન", 7: "જુલાઈ", 8: "ઑગસ્ટ", 9: "સપ્ટે", 10: "ઑક્ટો", 11: "નવે", 12: "ડિસે" };
			copy.dateFormat = "dd/mm/yyyy";
			copy.todayBtnTxt = "આજે";
		} else {
			copy.dayLabels = { su: "Sun", mo: "Mon", tu: "Tues", we: "Wed", th: "Thus", fr: "Fri", sa: "Sat" };
			copy.monthLabels = { 1: "Jan", 2: "Fev", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" };
			copy.dateFormat = "dd/mm/yyyy";
			copy.todayBtnTxt = "Today";
		}
		this.myDatePickerOptions = copy;
	}

	// Initialized to specific date (09.10.2018).
	public model: any = {
		date: {
			year: 2018,
			month: 4,
			day: 9
		}
	};

	ngOnInit() {
		this.onValueChange(new Date())
	}
	onValueChange(event) {
		let selectedDate = new Date(event);
		this.tableData = [];
		for (let index = 1; index <= selectedDate.getDate(); index++) {
			this.tableData.push({
				firstname: 'user ' + index + ' firstname',
				lastname: 'user ' + index + ' lastname',
				gender: 'male'
			})
		}
	}
	bookNewAppoinment() {
		alert('bookNewAppoinment');
	}
	onDateChanged(event: IMyDateModel) {
		let selectedDate = new Date(event.jsdate);
		this.tableData = [];
		for (let index = 1; index <= selectedDate.getDate(); index++) {
			this.tableData.push({
				firstname: 'user ' + index + ' firstname',
				lastname: 'user ' + index + ' lastname',
				gender: 'male'
			})
		}
		// event properties are: event.date, event.jsdate, event.formatted and event.epoc
	}
	onDisablePast(checked: boolean) {
		checked=true;
		let date = new Date();
		// Disable/enable dates from 1th backward
		date.setDate(date.getDate()-1);

		let copy = this.getCopyOfOptions();
		copy.disableUntil = checked ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : { year: 0, month: 0, day: 0 };
		//copy.disableSince = checked ? { year: date.getFullYear() + 1, month: date.getMonth() + 1, day: date.getDate() } : { year: 0, month: 0, day: 0 };
		this.myDatePickerOptions = copy;
	}
	getCopyOfOptions(): IMyDpOptions {
		return JSON.parse(JSON.stringify(this.myDatePickerOptions));
	}

}