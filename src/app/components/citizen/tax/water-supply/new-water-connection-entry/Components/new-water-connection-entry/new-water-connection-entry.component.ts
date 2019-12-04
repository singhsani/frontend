import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';
import { NewWaterConnectionEntryDataSharingService } from '../../Services/new-water-connection-entry-data-sharing.service';

@Component({
  selector: 'app-new-water-connection-entry',
  templateUrl: './new-water-connection-entry.component.html',
  styleUrls: ['./new-water-connection-entry.component.scss']
})
export class NewWaterConnectionEntryComponent implements AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  subscription: Subscription;
  currentIndex: number = 0;

  constructor(private newNewWaterConnectionEntryDataSharingService: NewWaterConnectionEntryDataSharingService) {

  }
  ngOnInit() {
    this.subscription = this.newNewWaterConnectionEntryDataSharingService.dataSourceMoveStepper.subscribe((data) => {
      if (data != null) {
        this.currentIndex = data;
        this.moveStepper(data);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.moveStepper(0);
    });
  }

  stepChanged(event, stepper){
    stepper.selected.interacted = false;
  }
}
