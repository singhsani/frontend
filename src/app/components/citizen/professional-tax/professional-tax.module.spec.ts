import { ProfessionalTaxModule } from './professional-tax.module';

describe('ProfessionalTaxModule', () => {
  let professionalTaxModule: ProfessionalTaxModule;

  beforeEach(() => {
    professionalTaxModule = new ProfessionalTaxModule();
  });

  it('should create an instance', () => {
    expect(professionalTaxModule).toBeTruthy();
  });
});
