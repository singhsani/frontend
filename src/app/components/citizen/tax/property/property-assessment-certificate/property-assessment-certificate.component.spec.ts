import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAssessmentCertificateComponent } from './property-assessment-certificate.component';

xdescribe('PropertyAssessmentCertificateComponent', () => {
	let component: PropertyAssessmentCertificateComponent;
	let fixture: ComponentFixture<PropertyAssessmentCertificateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PropertyAssessmentCertificateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PropertyAssessmentCertificateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
