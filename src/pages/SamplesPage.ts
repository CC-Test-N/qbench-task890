import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SamplesPage extends BasePage {
  private selectors: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    
    // Define all selectors as Locators
    this.selectors = {
      // Navigation
      workflowLink: page.getByText('Workflow'),
      samplesLink: page.locator('#navigation').getByText('Samples'),
      
      // Buttons
      createSamplesButton: page.getByRole('button', { name: '+ Create New Samples' }),
      addButton: page.getByRole('button', { name: 'Add' }),
      saveSamplesButton: page.getByRole('button', { name: 'Save Samples' }),
      
      // Form fields
      numberOfSamplesInput: page.getByRole('textbox', { name: 'Number of Samples' }),
      labNumberField: page.locator('td:nth-child(3) > .form-control').first(),
      field1: page.locator('td:nth-child(4) > .form-control'),
      field2: page.locator('td:nth-child(5) > .form-control').first(),
      dateField: page.locator('.qbench-sortable.non-sticky-col > .form-control').first(),
      additionalField: page.locator('td:nth-child(7) > .form-control'),
      
      // Table elements
      sampleTable: page.locator('table.samples-table, table'),
      sampleRows: page.locator('tr[data-sample-id], .sample-row, tbody tr')
    };
  }

  // Dynamic selectors
  private dateCell(day: string): Locator {
    return this.page.getByRole('cell', { name: day, exact: true }).nth(1);
  }

  // Sample creation
  async createNewSample(): Promise<string> {
    await this.navigateToOrder();
    
    // Start sample creation
    await this.clickAndWait(this.selectors.createSamplesButton);
    
    // Configure sample
    await this.configureSample();
    
    // Fill sample details
    const labNumber = await this.fillSampleDetails();
    
    // Save sample
    await this.saveSample();
    
    // Return to samples list
    await this.navigateToSamplesModule();
    
    return labNumber;
  }

  // Validation
  async validateSampleInList(): Promise<boolean> {
    await this.page.waitForTimeout(this.testData.timeouts.medium);

    try {
      const testValue = this.testData.samples.default.field1;
      const testSample = this.page.getByText(testValue).first();
      await testSample.waitFor({ 
        state: 'visible', 
        timeout: this.testData.timeouts.extraLong 
      });
      
      console.log(this.testData.validation.messages.sampleCreated);
      return true;
    } catch (error) {
      console.error('Sample validation failed:', error);
      return false;
    }
  }


  // Private helper methods
  private async navigateToSamplesModule(): Promise<void> {
    await this.clickAndWait(this.selectors.workflowLink);
    await this.clickAndWait(this.selectors.samplesLink);
    await this.waitForPageLoad(this.testData.timeouts.medium);
  }

  private async navigateToOrder(): Promise<void> {
    const customer = this.testData.orders.default.customer;
    const orderRow = this.findRowWithText(customer);
    const orderLink = orderRow.getByRole('link').first();
    await orderLink.click();
    await this.waitForPageLoad();
  }

  private async configureSample(): Promise<void> {
    const numberOfSamples = this.testData.samples.default.numberOfSamples.toString();
    await this.fillInput(this.selectors.numberOfSamplesInput, numberOfSamples);
    await this.clickAndWait(this.selectors.addButton);
  }

  private async fillSampleDetails(): Promise<string> {
    const sampleData = this.testData.samples.default;
    
    // Unique lab number
    const uniqueLabNumber = this.generateUniqueId(sampleData.labNumberPrefix);
    await this.fillInput(this.selectors.labNumberField, uniqueLabNumber);
    console.log(`Creating sample: ${uniqueLabNumber}`);
    
    // Test fields
    await this.fillInput(this.selectors.field1, sampleData.field1);
    await this.fillInput(this.selectors.field2, sampleData.field2);
    
    // Date selection
    await this.selectors.dateField.click();
    await this.dateCell(sampleData.dateDay).click();
    
    // Additional field
    await this.fillInput(this.selectors.additionalField, sampleData.additionalField);
    
    return uniqueLabNumber;
  }

  private async saveSample(): Promise<void> {
    await this.clickAndWait(this.selectors.saveSamplesButton);
    await this.waitForPageLoad(this.testData.timeouts.medium);
  }
}