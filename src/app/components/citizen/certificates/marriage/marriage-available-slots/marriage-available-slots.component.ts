import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AppointmentServices } from '../../../appointment/appointment.service';
import { SlotDetails } from '../../../appointment/schedule-appointment/slot-booking/slot-booking.component';

@Component({
  selector: 'app-marriage-available-slots',
  templateUrl: './marriage-available-slots.component.html',
  styleUrls: ['./marriage-available-slots.component.scss']
})
export class MarriageAvailableSlotsComponent implements OnInit {

  @Input() resources: string;
  @Input() appointmentdate: string;
  @Input() search: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  slotDataSource = new MatTableDataSource();
  appointmentForm: FormGroup;
  translateKey: string = 'marrstiageRateMaster';
  displayedColumns = ['date', 'end time', 'status'];

  constructor(
    private commonService: CommonService,
    private appointmentService: AppointmentServices,
  ) { }


  ngOnInit() {
    this.getAvailableSlot();
  }

  getAvailableSlot() {

    let resourceCodeForSlots = this.resources;
    let startdateForSlots = this.appointmentdate;
    this.appointmentService.getAvailableSlots(resourceCodeForSlots, startdateForSlots).subscribe(slot => {
      this.slotDataSource.data = slot.data.filter(s => s.slotStatus == 'AVAILABLE');
      this.slotDataSource.paginator = this.paginator;
      this.paginator.pageSize = 5;
      this.paginator.pageIndex = 0;
    },
      err => {
        if (err.error[0])
          this.commonService.openAlert("error", err.error[0].message, "error");
      });
  }

}
