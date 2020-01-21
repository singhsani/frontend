import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.scss']
})
export class GuidelinesComponent implements OnInit {

  @Input('isGuileLineActive') isGuileLineActive: boolean;
  @Input('message') message: Array<string>;
  @Input('listMessage') listMessage: Array<string>;
  @Input() moreListMsg: Array<string>;


  @Output('hideGuideLine') hideGuideLine: EventEmitter<any> = new EventEmitter();

  translateKey: string = "GuideLineScreen";

  vmcLink:string="https://vmc.gov.in/pdf/Forms/Form%20for%20Marriage%20Registration%20&%20Guideline%20for%20NRI%20Marriage.pdf";

  constructor() { }

  ngOnInit() {


  }

}
