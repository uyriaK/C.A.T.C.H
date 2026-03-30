// --- Helper Functions ---
const findValueByLabel = (labelText) => {
  const xpath = `//*[contains(text(), '${labelText}')]`;
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const el = result.singleNodeValue;
  if (el) {
    if (el.nextElementSibling) return el.nextElementSibling.innerText.trim();
    if (el.parentElement) return el.parentElement.innerText.replace(labelText, '').trim();
  }
  return null;
};

// --- UPDATED DEVICE SCRAPER (Structured Data) ---
const scrapeDevices = () => {
  const xpath = `//*[contains(text(), 'CXNK')]`;
  const snapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  
  const devicesMap = new Map(); 
  let primaryOntFsan = null;
  let firstDeviceFsan = null; 
  let ontFound = false;

  for (let i = 0; i < snapshot.snapshotLength; i++) {
    const el = snapshot.snapshotItem(i);
    const text = (el.innerText || el.textContent || "").trim();
    
    const fsan = text.replace(/[^A-Z0-9]/ig, ''); 
    
    if (!fsan.startsWith("CXNK") || fsan.length > 15) continue;

    let model = "Device"; 
    if (el.previousElementSibling) {
      const prevText = (el.previousElementSibling.innerText || el.previousElementSibling.textContent || "").trim();
      if (prevText && prevText.length < 25) model = prevText;
    }

    if (devicesMap.has(fsan)) {
        const existingModel = devicesMap.get(fsan).model;
        if (model !== "Device" && existingModel === "Device") {
            devicesMap.set(fsan, { model, fsan });
        }
    } else {
        devicesMap.set(fsan, { model, fsan });
    }

    if (!firstDeviceFsan) firstDeviceFsan = fsan;
    if (model.includes("ONT")) {
      primaryOntFsan = fsan;
      ontFound = true;
    }
  }

  // Build a structured array instead of an HTML string
  const devicesArray = [];
  devicesMap.forEach((data, key) => {
      devicesArray.push({
          model: data.model,
          fsan: data.fsan,
          isOnt: data.model.includes("ONT")
      });
  });

  if (!primaryOntFsan && firstDeviceFsan) primaryOntFsan = firstDeviceFsan;
  let noOntWarning = (!ontFound && devicesArray.length > 0);

  return { 
      devices: devicesArray, 
      targetFsan: primaryOntFsan,
      hasDevices: devicesArray.length > 0,
      noOntWarning: noOntWarning
  };
};

// --- DATE RANGE SCRAPER ---
const scrapeDateRange = () => {
    let dateRange = null;
    
    const specificInput = document.querySelector('input[placeholder="Select Date"], input[aria-label="Select Date"], input[role="combobox"].p-inputtext');
    if (specificInput && specificInput.value && specificInput.value.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
        return specificInput.value;
    }
    
    const primeInputs = document.querySelectorAll('input.p-inputtext.p-component');
    for (let input of primeInputs) {
        if (input.value && input.value.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
            dateRange = input.value;
            break;
        }
    }
    
    if (!dateRange) {
        const allInputs = document.querySelectorAll('input');
        for (let input of allInputs) {
            if (input.value && input.value.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                dateRange = input.value;
                break; 
            }
        }
    }
    return dateRange;
};

// --- CRM SCRAPER ---
const scrapeCRM = () => {
    const url = window.location.href;
    const urlMatch = url.match(/accountNumber=(\d+)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];

    const accountContainer = document.querySelector('[formcontrolname="accountID"]');
    if (accountContainer) {
        const val = accountContainer.innerText.trim();
        if (val.match(/^\d{5,10}$/)) return val;
    }

    const linkXpath = "//a[contains(text(), 'Account #')]";
    const linkResult = document.evaluate(linkXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (linkResult.singleNodeValue) {
        const text = linkResult.singleNodeValue.innerText;
        const match = text.match(/Account #(\d+)/);
        if (match && match[1]) return match[1];
    }

    const labelXpath = "//*[contains(text(), 'Account')]";
    const snapshot = document.evaluate(labelXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < snapshot.snapshotLength; i++) {
        const element = snapshot.snapshotItem(i);
        let fullText = element.innerText;
        if (element.parentElement) fullText = element.parentElement.innerText + " " + fullText;
        const match = fullText.match(/Account:?\s*(\d{4,10})/);
        if (match && match[1] && match[1].length <= 8) return match[1];
    }
    return null;
};

// --- MAIN LOOP ---
function scrape() {
  const data = {};
  let mode = null;
  
  const crmAccount = scrapeCRM();
  if (crmAccount) {
      chrome.runtime.sendMessage({ type: "CRM_UPDATE", account: crmAccount }).catch(err => {});
  }

  const deviceData = scrapeDevices();
  if (deviceData.hasDevices) {
      mode = "System";
      data["Devices Found"] = deviceData.devices; 
      data["TargetFSAN"] = deviceData.targetFsan;
      data["No ONT Warning"] = deviceData.noOntWarning;
      data["ONT Status"] = findValueByLabel("ONT Status");
      data["PON Status"] = findValueByLabel("PON Status");
      data["ONT Rx Power"] = findValueByLabel("ONT Rx Power");
      data["OLT Rx Power"] = findValueByLabel("OLT Rx Power");
  } 
  else if (document.body.innerText.includes("ONT Health") || document.body.innerText.includes("PON Status")) {
      mode = "System";
  }
  
  else if (document.body.innerText.includes("Speed Test Details")) {
    mode = "Service";
    data["Download Speed"] = findValueByLabel("Download Speed");
    data["Upload Speed"] = findValueByLabel("Upload Speed");
  }

  if (mode) {
    chrome.runtime.sendMessage({ type: "DATA_UPDATE", mode: mode, data: data }).catch(err => {}); 
  }
  
  if (window.location.href.includes("/alerts/") || document.body.innerText.includes("Historical Reports") || document.body.innerText.includes("Alarms by Severity")) {
     const dateResult = scrapeDateRange();
     if (dateResult) {
         chrome.runtime.sendMessage({ type: "DATE_UPDATE", data: dateResult }).catch(err => {});
     }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PING") scrape();
});

let timeout = null;
const triggerScrape = (delay = 800) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => { scrape(); }, delay);
};

const observer = new MutationObserver((mutations) => {
  triggerScrape(800);
});
observer.observe(document.body, { childList: true, subtree: true, characterData: true });

document.addEventListener('click', () => {
    triggerScrape(1500); 
});

// --- AUTO-FILL ---
if (window.location.href.includes("history-reports")) {
    chrome.storage.local.get("pendingFSAN", (result) => {
        if (result.pendingFSAN) {
            let attempts = 0;
            const fillInterval = setInterval(() => {
                attempts++;
                let input = document.querySelector('input[placeholder="FSAN"]');
                if (!input) input = document.querySelector('input[name="fsan"]');
                if (!input) {
                    const allLabels = Array.from(document.querySelectorAll('label, div, span'));
                    const fsanLabel = allLabels.find(el => el.innerText.trim() === "FSAN");
                    if (fsanLabel && fsanLabel.nextElementSibling) input = fsanLabel.nextElementSibling.querySelector('input');
                }
                if (input) {
                    input.style.border = "2px solid red";
                    input.style.backgroundColor = "#fff0f0";
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, result.pendingFSAN);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    clearInterval(fillInterval); 
                    chrome.storage.local.remove("pendingFSAN");
                }
                if (attempts > 30) clearInterval(fillInterval);
            }, 500); 
        }
    });
}
if (window.location.href.includes("service/home")) {
    chrome.storage.local.get("pendingAccount", (result) => {
        if (result.pendingAccount) {
            let attempts = 0;
            const searchInterval = setInterval(() => {
                attempts++;
                let input = document.querySelector('input[placeholder*="Search"]');
                if (!input) input = document.querySelector('input[type="text"]');
                if (input) {
                    input.style.border = "3px solid #28a745"; 
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, result.pendingAccount);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                    clearInterval(searchInterval);
                    chrome.storage.local.remove("pendingAccount");
                }
                if (attempts > 20) clearInterval(searchInterval);
            }, 500);
        }
    });
}