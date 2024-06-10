const { chromium } = require('playwright');
const config = require('./config.json');

async function getRegistrations() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://clear.codeday.org/');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByPlaceholder('username/email').click();
  await page.getByPlaceholder('username/email').fill(config.username);
  await page.getByPlaceholder('your password').click();
  await page.getByPlaceholder('your password').fill(config.password);
  await page.getByLabel('Log In').click();
  await page.getByRole('link', { name: 'Kolkata - Summer 2024 Jul' }).click();
  let count = await page.getByRole('heading', { name: 'Registrations' }).textContent();
  await browser.close();
  return count.trim(); // Ensure to trim any extra whitespace
}

module.exports = getRegistrations;
