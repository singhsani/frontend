import { Directive, OnInit, Input, HostListener, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReload]'
})
export class ReloadDirective implements OnInit {
  @Input() isFormSaved: boolean;
  @Input() form : any
  constructor(private elm : ElementRef) { }

  ngOnInit(){

  }
handleNavigation
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadEvent(event: BeforeUnloadEvent) {
    if(!this.isFormSaved && this.form.touched){
      event.returnValue = null;
    }
  }
}
