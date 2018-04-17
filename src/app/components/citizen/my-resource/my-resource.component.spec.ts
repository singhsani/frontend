import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResourceComponent } from './my-resource.component';

describe('MyResourceComponent', () => {
	let component: MyResourceComponent;
	let fixture: ComponentFixture<MyResourceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MyResourceComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyResourceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
