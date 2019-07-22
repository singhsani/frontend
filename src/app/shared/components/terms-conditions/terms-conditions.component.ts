import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { TermsConditionsService } from '../../../core/services/citizen/data-services/terms-conditions.service';

@Component({
  selector: 'terms-conditions',
  template: `<a class="stretchedLink" (click)="loadGuideLine()">Guideline/Terms and Conditions</a>  `,
  styles: [`.stretchedLink{color: #673ab7 !important;} `]
})
export class TermsConditionsComponent implements OnInit {
  @Input() moduleNameParam?: any;
  
  constructor(private service: TermsConditionsService,
    private dialog: MatDialog) { }

  ngOnInit() {
    
  }
  /**
   * Link for agreement.
   */
  loadGuideLine() {
    let sectionToPrint;
    this.service.loadGuideLine(this.moduleNameParam.moduleName, this.moduleNameParam.resourName).subscribe(resp => {
      sectionToPrint = document.getElementById('sectionTextPrint');
      sectionToPrint.innerHTML = resp;
    });

    const dialogRef = this.dialog.open(DialogContentComponent, sectionToPrint);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }
}

/**
 * This component for dialog content
 */
@Component({
  selector: 'dialog-content',
  template: `<h2 mat-dialog-title>Terms and conditions</h2>
                <mat-dialog-content class="mat-typography">
                   <div id="sectionTextPrint"></div>
                 </mat-dialog-content>
                 
              <mat-dialog-actions align="end">
                 <button mat-button mat-dialog-close>Close</button>
              </mat-dialog-actions>
  `
})
export class DialogContentComponent { }
