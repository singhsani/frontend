import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTransferComponent } from './property-transfer.component';

xdescribe('PropertyTransferComponent', () => {
    let component: PropertyTransferComponent;
    let fixture: ComponentFixture<PropertyTransferComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PropertyTransferComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
