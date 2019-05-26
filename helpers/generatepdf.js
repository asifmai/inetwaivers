const User = require('../models/User');
const Waiver = require('../models/Waiver');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

module.exports = (data, waiverID) => new Promise(async (resolve, reject) => {
  try {
    const pdfPath = path.resolve(__dirname, `../content/signedwaivers/${waiverID}.pdf`);
    const htmlContent = await generateHTML(data);
    const pdfContent = await generatePDF(htmlContent, pdfPath);
    resolve(pdfContent);
  } catch (error) {
    reject(error);
  }
});

const generateHTML = (data) => new Promise(async (resolve, reject) => {
  try {
    const userInfo = await User.findById(data.userid);
    const waiverInfo = await Waiver.findById(data.waiverid);
    const path1 = path.resolve(__dirname, `../content/waivers/${waiverInfo.filename1}`);
    const path2 = path.resolve(__dirname, `../content/waivers/${waiverInfo.filename2}`);
    const waivercontent1 = fs.readFileSync(path1, 'utf8');
    const waivercontent2 = fs.readFileSync(path2, 'utf8');
    let html = ``;
    html = waivercontent1;
    
    const participantName = `<p><span>Sign Participant Name:</span><span style="text-decoration: underline; margin-left: 1em;">${userInfo.firstname} ${userInfo.lastname}</span></p>`;
    html += participantName;

    const participantSignature = `<img src="${data.signature1}">`
    html +=participantSignature;

    const participantName2 = `<p><span>Print Participant Name: </span><span style="text-decoration: underline; margin-left: 1em; margin-right: 1em;">${userInfo.firstname} ${userInfo.lastname}</span><span>Age</span><span style="text-decoration: underline; margin-left: 1em; margin-right: 1em;">${data.age}</span><span>Date</span><span style="text-decoration: underline; margin-left: 1em; margin-right: 1em;">${data.date}</span></p>`
    html += participantName2;

    html += waivercontent2;

    const guardianName = `<p><span>Sign Parent/Guardian Name:</span><span style="text-decoration: underline; margin-left: 1em;">${data.guardianname}</span></p>`;
    html += guardianName;

    const guardianSignature = `<img src="${data.signature2}">`;
    html += guardianSignature;

    const guardianName2 = `<p><span>Print Parent/Guardian Name:</span><span style="text-decoration: underline; margin-left: 1em;">${data.guardianname}</span></p><p><span>Date</span><span style="text-decoration: underline; margin-left: 1em; margin-right: 1em;">${data.date}</span><span>Emergency Phone</span><span style="text-decoration: underline; margin-left: 1em; margin-right: 1em;">${data.phonenumber}</span></p>`;
    html += guardianName2;

    resolve(html);
  } catch (error) {
    reject(error);
  }
})

const generatePDF = (html, pdfPath) => new Promise(async (resolve, reject) => {
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true // printo to pdf only works in headless mode currently
    });
    page = await browser.newPage();
  
    // this section can loop for processing of multiple files if needed.
    await page.setContent(html);
    await page.emulateMedia('print');
    await page.pdf({
      path: pdfPath, 
      format: 'A4',
      displayHeaderFooter: true,
      // , printBackground: true
      // , landscape: true
      margin: { top: "50", right: "50", bottom: "50", left: "50" }
    });
    
    await browser.close();

    resolve(true);
  } catch (error) {
    reject(error);
  }
})
