import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Upload -> Preview smoke', () => {
  beforeAll(async () => {
    await browser.waitForAngularEnabled(true);
  });

  it('should show upload input on /upload', async () => {
    await browser.get('/upload');
    // Wait for presence of input[type=file] or a common upload selector
    const uploadInput = element(by.css('input[type=file], input[type="file"]'));
    await browser.wait(EC.presenceOf(uploadInput), 5000, 'Upload input not present');
    expect(await uploadInput.isPresent()).toBe(true);
  });
});
