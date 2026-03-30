<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/Favicon.png" alt="Logo" width="160" height="160">
  </a>

<h3 align="center">C.A.T.C.H.</h3>
<h1 align="center">Calix Alarm & Ticket Creation Helper</h1>


  <p align="center">
    NOC Ticket Companion
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/uyriaK/SEEKR/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>

A Google Chrome Extension designed to streamline troubleshooting, data collection, and ticket creation for ISPs utilizing Calix Support Cloud, Calix Operations Cloud, and iVUE.

## 📖 Overview

When diagnosing customer network issues, support technicians often have to juggle multiple tabs, manually copy-paste FSANs (serial numbers), hunt down optical power levels, and manually tally historical alarms.

The Calix Trouble Ticket Helper acts as an automated companion. It seamlessly monitors the active browser tab to extract critical customer data—such as account numbers, ONT/PON status, Rx/Tx optical power, speed test results, and device lists—and organizes them into a clean side panel. It also bridges the gap between Calix Service Cloud and Calix Operations Cloud by auto-porting the customer's FSAN directly into the historical alarms search field, saving time and reducing human error.

[![Product Name Screen Shot][product-screenshot0]](https://example.com)
The program reads the customer's account number from IVC and stores it within the search bar. Click "GO" on the search bar.

[![Product Name Screen Shot][product-screenshot0.5]](https://example.com)
The program will then take you to Calix Cloud. The account number will be autofilled into the search bar upon reaching Calix Cloud.


## ✨ Key Features
- Real-Time SPA Monitoring: Uses MutationObserver to instantly detect when a user clicks to a new customer profile in Single Page Applications (like iVUE or Calix Angular frameworks) without requiring a page refresh.

- Hardware & Speed Data Scraping: Automatically reads and extracts:

  - ONT & PON Status (Online, Offline, ONTs Present)

  - ONT & OLT Rx Power Levels (dBm)

- Intelligent Device Deduplication: Finds all devices (ONTs and Residential Gateways) on the page, strips hidden characters, maps models to their specific FSANs, and removes duplicates.

- Downstream Device Tracking: Provides interactive "Online? (Yes/No)" dropdowns for secondary hardware (like the GS4220E or GM2037) directly in the side panel, preserving selections in local storage.

- Ops Cloud Automation: Includes an "Add Alarm" action button that opens the Calix Operations Cloud Historical Reports page, automatically closing/re-opening the tab to bypass SSO delays, and auto-filling the ONT FSAN into the target search field.

- Dynamic Alarm Builder: Replaces tedious chart-reading with an interactive, alphabetized checklist. Technicians can quickly tally historical alarms (e.g., ont-dying-gasp, low-rx-opt-pwr-ne).

- One-Click Ticket Formatting: Compiles all scraped data, manual alarm tallies, and automated alarm definitions into a standardized, easy-to-read text block that is instantly copied to the clipboard for pasting into trouble tickets.

[![Product Name Screen Shot][product-screenshot1]](https://example.com)

After clicking the magnifying glass next to the search bar and pulling up the corresponding account, click the "System" tab. The program will then pull in all relevant information inlcuding light levels (if applicable) FSANs, and device types. This is also where the user can specify which customer devices are online and which aren't.

[![Product Name Screen Shot][product-screenshot2]](https://example.com)


[![Product Name Screen Shot][product-screenshot3]](https://example.com)

Clicking the "Add Alarm" button launches Calix Operations Cloud. This where all the historical ONT alarms reside. Upon clicking this button, the user will be directed to the "Historical Reports" section of Operations Cloud. The ONTs FSAN will be autofilled into the "FSAN" field. You may also update the date range in which you would like to search here. The program will update it's range as well.

[![Product Name Screen Shot][product-screenshot4]](https://example.com)

Within the sidebar there is a dropdown that allows you to select the alarms that you see being reported in Operations Cloud. You select the alarm and then the quantity of the alarm. The program will record a total cound of alarms.

[![Product Name Screen Shot][product-screenshot5]](https://example.com)

After all of the relevant ticket information is recorded, click "Copy All to Clipboard". The following is the output for the example we've been following.

[![Product Name Screen Shot][product-screenshot6]](https://example.com)

## 🛠️ Target Applications

This extension is specifically optimized for the DOM structures and frameworks of:

- iVUE Connect (Account lookup and extraction)

- Calix Support Cloud (Service) (Hardware, FSAN, and Speed extraction)

- Calix Operations Cloud (Alerts/System) (Alarm history and FSAN auto-filling)

## 🚀 Installation (Unpacked)
1. Clone or download this repository to your local machine.

2. Open Google Chrome and navigate to chrome://extensions/.

3. Enable "Developer mode" in the top right corner.

4. Click "Load unpacked" and select the folder containing the extension files.

5. Pin the extension to your toolbar and open the Chrome Side Panel to use it.

### Built with:

- [![HTML][HTML.com]][HTML-url]
- [![CSS][CSS.com]][CSS-url]
- [![JS][JS.com]][JS-url]

<!-- LICENSE -->

<!-- CONTACT -->
## Contact

Jaylen Bryant - jbryant@bulloch.solutions

Project Link: https://github.com/uyriaK/OpticOps

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[HTML.com]:   https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML-url]: https://html.com
[CSS.com]: https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://w3schools.com
[JS.com]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[JS-url]: https://www.javascript.com
[product-screenshot0]: images/OpticOpsSS0.png
[product-screenshot0.5]: images/OpticOpsSS0.5.png
[product-screenshot1]: images/OpticOpsSS1.png
[product-screenshot2]: images/OpticOpsSS2.png
[product-screenshot3]: images/OpticOpsSS3.png
[product-screenshot4]: images/OpticOpsSS4.png
[product-screenshot5]: images/OpticOpsSS5.png
[product-screenshot6]: images/OpticOpsSS6.png
[product-result]: images/result.png

