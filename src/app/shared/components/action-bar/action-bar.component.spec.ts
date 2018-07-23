import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarComponent } from './action-bar.component';
import { AngularWebStorageModule, SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';




describe('ActionBarComponent', () => {
  let component: ActionBarComponent;

  let fixture: ComponentFixture<ActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      declarations: [ActionBarComponent],
      providers: [SessionStorageService, FormsActionsService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Action Bar', () => {
    expect(component).toBeTruthy();
  });
});
