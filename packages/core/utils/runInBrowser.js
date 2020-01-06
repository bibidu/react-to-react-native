const path = require('path')
const puppeteer = require('puppeteer')

const DEBUG = false
const config = DEBUG ? { headless: false, devtools: true } : { headless: true, devtools: false }

module.exports = async function runInBrowser({ script }) {
  const browser = await puppeteer.launch(config)
  const page = await browser.newPage()
  // await page.goto('file:' + path.join(process.cwd(), 'index.html'))

  await page.addScriptTag({
    content: script
  })
  
  await page.waitForSelector('#result')
  const handle = await page.evaluateHandle(() => document.querySelector('#result'));
  const resultHandle = await page.evaluateHandle(result => result.innerText, handle);
  const result = await resultHandle.jsonValue()
  if (!DEBUG) {
    await browser.close()
  }
  return result ? JSON.parse(result) : {}
}