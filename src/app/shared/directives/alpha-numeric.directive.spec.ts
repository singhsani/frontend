import { AlphaNumericDirective } from './alpha-numeric.directive';
import { ElementRef, Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
    template: `<input type="text" appAlphaNumeric>`
})
class TestAlphaNumberic {

}


describe('Directive : AlphaNumericDirective', () => {
    let elementRef: ElementRef;
    let component: TestAlphaNumberic;
    let fixture: ComponentFixture<TestAlphaNumberic>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlphaNumericDirective, TestAlphaNumberic]
        });

        fixture = TestBed.createComponent(TestAlphaNumberic);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('input'));
    })
    it('should create an instance', () => {
        const directive = new AlphaNumericDirective(elementRef);
        expect(directive).toBeTruthy();
    });

    it('Should Accept Only Alpha Numberic Input', () => {
        /**
         * Enter Input in input box and test.
         */

    });

});
