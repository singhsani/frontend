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



  @Output('hideGuideLine') hideGuideLine: EventEmitter<any> = new EventEmitter();

  translateKey: string = "translate";

  constructor() { }

  ngOnInit() {


  }

}
