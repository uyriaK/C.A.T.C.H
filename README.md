<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Optic Ops</h3>

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
[![Product Name Screen Shot][product-screenshot0.5]](https://example.com)


## ✨ Key Features
- Real-Time SPA Monitoring: Uses MutationObserver to instantly detect when a user clicks to a new customer profile in Single Page Applications (like iVUE or Calix Angular frameworks) without requiring a page refresh.

- Hardware & Speed Data Scraping: Automatically reads and extracts:

  - ONT & PON Status (Online, Offline, ONTs Present)

  - ONT & OLT Rx Power Levels (dBm)

  - Latest Speed Test Results (Download/Upload)

- Intelligent Device Deduplication: Finds all devices (ONTs and Residential Gateways) on the page, strips hidden characters, maps models to their specific FSANs, and removes duplicates.

- Downstream Device Tracking: Provides interactive "Online? (Yes/No)" dropdowns for secondary hardware (like the GS4220E or GM2037) directly in the side panel, preserving selections in local storage.

- Ops Cloud Automation: Includes an "Add Alarm" action button that opens the Calix Operations Cloud Historical Reports page, automatically closing/re-opening the tab to bypass SSO delays, and auto-filling the ONT FSAN into the target search field.

- Dynamic Alarm Builder: Replaces tedious chart-reading with an interactive, alphabetized checklist. Technicians can quickly tally historical alarms (e.g., ont-dying-gasp, low-rx-opt-pwr-ne).

- One-Click Ticket Formatting: Compiles all scraped data, manual alarm tallies, and automated alarm definitions into a standardized, easy-to-read text block that is instantly copied to the clipboard for pasting into trouble tickets.

[![Product Name Screen Shot][product-screenshot1]](https://example.com)
[![Product Name Screen Shot][product-screenshot2]](https://example.com)
[![Product Name Screen Shot][product-screenshot3]](https://example.com)
[![Product Name Screen Shot][product-screenshot4]](https://example.com)
[![Product Name Screen Shot][product-screenshot5]](https://example.com)
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

5. Pin the extension to your toolbar and open the Chrome Side Panel to use it.****

### Built with:

- [![HTML][HTML.com]][HTML-url]
- [![CSS][CSS.com]][CSS-url]
- [![JS][JS.com]][JS-url]

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


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

