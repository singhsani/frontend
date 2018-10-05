import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyReAssessmentAppComponent } from './property-re-assessment-app.component';

xdescribe('PropertyReAssessmentAppComponent', () => {
	let component: PropertyReAssessmentAppComponent;
	let fixture: ComponentFixture<PropertyReAssessmentAppComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PropertyReAssessmentAppComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PropertyReAssessmentAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
