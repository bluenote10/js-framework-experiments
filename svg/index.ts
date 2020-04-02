import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as xml2js from 'xml2js'
import { fstat } from 'fs';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*
(async() => {
  const url = `file:${path.join(__dirname, 'drawing.svg')}`
  console.log(url)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.pdf({path: 'page.pdf', format: 'A4'});

  await browser.close();
})();
*/

async function loadSvg(filename: string) {

  const data = await fs.promises.readFile(path.join(__dirname, filename))
  console.log(data)

  const parser = new xml2js.Parser({
    explicitChildren: true,
    preserveChildrenOrder: true,
  });
  const xml = await parser.parseStringPromise(data)

  console.log(JSON.stringify(xml, null, 2))
  return xml
}

async function loadSvgDom(filename: string) {

  const data = await fs.promises.readFile(path.join(__dirname, filename))
  console.log(data)

  const doc = new JSDOM(data);

  console.log(doc)
  console.log(doc.window.document.documentElement.innerHTML)
  console.log(JSON.stringify(doc, null, 2))
  return doc
}

async function run() {
  //let frameA = await loadSvg("svg_example.svg")
  //let frameB = await loadSvg("frame2.svg")

  let frameA = await loadSvgDom("svg_example.svg")
}

run()




