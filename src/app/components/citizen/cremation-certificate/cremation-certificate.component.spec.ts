import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CremationCertificateComponent } from './cremation-certificate.component';

describe('CremationCertificateComponent', () => {
	let component: CremationCertificateComponent;
	let fixture: ComponentFixture<CremationCertificateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CremationCertificateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CremationCertificateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
