// --- CONFIGURATION ---
const ALARM_DEFINITIONS = {
  "low-rx-opt-pwr-ne": "Low Optical Power received, Near-End",
  "low-tx-opt-pwr-fe": "Low transmit optical power from an ONT.",
  "ont-battery-failed": "ONT battery failed",
  "ont-battery-low": "ONT battery is low",
  "ont-battery-missing": "ONT battery is missing",
  "ont-dying-gasp": "ONT is out of service due to loss of power event detected by the ONT.",
  "ont-eth-down": "This alarm is set when the ont reports no signal present on an enabled ethernet interface.",
  "ont-missing": "Provisioned ONT is not accessible on the PON",
  "ont-us-sdber": "ONT Upstream SDBER rate exceeded",
  "sipua-register-auth": "Cannot authenticate a registration server"
};

// Alphabetized List
const ALARM_LIST = [
  "low-rx-opt-pwr-fe",
  "low-rx-opt-pwr-ne",
  "low-tx-opt-pwr-fe",
  "ont-battery-failed",
  "ont-battery-low",
  "ont-battery-missing",
  "ont-dying-gasp",
  "ont-eth-down",
  "ont-missing",
  "ont-us-sdber",
  "running-config-unsaved",
  "sipua-register-auth"
];

let storage = {
  system: null,
  service: null,
  dateRange: "Unknown Range",
  deviceStates: {} 
};

// --- INIT DYNAMIC ALARM UI ---
function initAlarmDropdown() {
    const select = document.getElementById("alarmSelect");
    ALARM_LIST.forEach(alarm => {
        const opt = document.createElement("option");
        opt.value = alarm;
        opt.innerText = alarm;
        select.appendChild(opt);
    });
}
initAlarmDropdown();

// Recalculates the total across all visible alarm inputs
function updateAlarmTotal() {
    let total = 0;
    document.querySelectorAll('.alarm-input').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    document.getElementById("alarmTotalDisplay").innerText = total;
}

// Logic for the "+" Button
document.getElementById("addAlarmBtn").addEventListener("click", () => {
    const select = document.getElementById("alarmSelect");
    const alarmName = select.value;
    
    if (!alarmName) return; 

    // If they already added this alarm, just bump the number up by 1
    const existingInput = document.querySelector(`.alarm-input[data-alarm="${alarmName}"]`);
    if (existingInput) {
        existingInput.value = parseInt(existingInput.value || 0) + 1;
        updateAlarmTotal();
        select.value = ""; 
        return;
    }

    // Build the new row
    const container = document.getElementById("dynamic-alarms-container");
    const div = document.createElement("div");
    div.className = "alarm-item";
    div.innerHTML = `
        <span class="alarm-name">${alarmName}</span>
        <div style="display:flex; gap: 5px; align-items: center;">
            <input type="number" min="1" class="alarm-input" data-alarm="${alarmName}" value="1">
            <button class="remove-alarm-btn" style="background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 4px 6px; font-size: 10px; font-weight: bold;">X</button>
        </div>
    `;
    container.appendChild(div);

    // Listeners for this specific row (Update total on type, or remove row on X)
    div.querySelector('.alarm-input').addEventListener('input', updateAlarmTotal);
    div.querySelector('.remove-alarm-btn').addEventListener('click', () => {
        div.remove();
        updateAlarmTotal();
    });

    select.value = ""; // Reset dropdown after adding
    updateAlarmTotal();
});

// --- MESSAGE LISTENERS ---
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "DATA_UPDATE") {
    if (message.mode === "System") storage.system = message.data;
    if (message.mode === "Service") storage.service = message.data;
    renderUI();
  }
  if (message.type === "CRM_UPDATE") {
      const input = document.getElementById("accountInput");
      if (input && message.account && input.value !== message.account) {
          input.value = message.account;
          input.style.backgroundColor = "#e8f5e9";
          setTimeout(() => input.style.backgroundColor = "white", 1000);
      }
  }
  if (message.type === "DATE_UPDATE") {
      storage.dateRange = message.data;
      const display = document.getElementById("date-range-display");
      if (display) display.innerText = `Range: ${storage.dateRange}`;
  }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (tabs[0]?.id) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "PING"}, () => {
       if (chrome.runtime.lastError) document.getElementById("status").innerText = "Please refresh the page.";
    });
  }
});

// --- BUTTON HANDLERS ---
document.getElementById("searchBtn").addEventListener("click", () => {
    const accountNum = document.getElementById("accountInput").value.trim();
    if (accountNum) {
        chrome.storage.local.set({ "pendingAccount": accountNum }, () => {
            chrome.tabs.create({ url: "https://cloud-us.calix.com/service/home" });
        });
    } else {
        chrome.tabs.create({ url: "https://cloud-us.calix.com/service/home" });
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    storage = { system: null, service: null, dateRange: "Unknown Range", deviceStates: {} };
    renderUI();
    document.getElementById("date-range-display").innerText = "Range: Unknown";
    chrome.storage.local.remove(["pendingFSAN", "pendingAccount"]);
    document.getElementById("status").innerText = "Session Reset.";
    document.getElementById("accountInput").value = "";
    
    // Clear all dynamic alarms
    document.getElementById("dynamic-alarms-container").innerHTML = "";
    updateAlarmTotal();
});

document.getElementById("alarmBtn").addEventListener("click", () => {
    try {
        const targetUrl = "https://cloud-us.calix.com/cco/alerts/system/history-reports";
        const fsanToFill = storage.system ? storage.system["TargetFSAN"] : "";
        
        const executeOpenCloseOpen = () => {
            chrome.tabs.create({ url: targetUrl }, (initialTab) => {
                setTimeout(() => {
                    chrome.tabs.remove(initialTab.id, () => {
                        if (fsanToFill) {
                            chrome.storage.local.set({ "pendingFSAN": fsanToFill }, () => {
                                chrome.tabs.create({ url: targetUrl });
                            });
                        } else {
                            chrome.tabs.create({ url: targetUrl });
                        }
                    });
                }, 1500); 
            });
        };

        if (!chrome.storage) {
            executeOpenCloseOpen();
            return;
        }
        
        if (fsanToFill) {
            chrome.storage.local.set({ "pendingFSAN": fsanToFill }, () => {
                executeOpenCloseOpen();
            });
        } else {
            executeOpenCloseOpen();
        }
    } catch (err) { alert("Error: " + err.message); }
});

// --- UPDATED CLIPBOARD LOGIC ---
document.getElementById("copyBtn").addEventListener("click", () => {
  let text = "";
  
  const acc = document.getElementById("accountInput").value;
  if (acc) text += `Account: ${acc}\n\n`;

  if (storage.system) {
    text += "--- SYSTEM INFO ---\n";
    
    for (const [key, val] of Object.entries(storage.system)) {
      if (key !== "TargetFSAN" && key !== "Devices Found" && key !== "No ONT Warning" && val) {
          const cleanVal = val.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          text += `${key}: ${cleanVal}\n`;
      }
    }
    text += "\n";
    
    if (storage.system["Devices Found"] && Array.isArray(storage.system["Devices Found"])) {
        storage.system["Devices Found"].forEach(d => {
            text += `${d.model}\n${d.fsan}`;
            if (!d.isOnt) {
                let state = storage.deviceStates[d.fsan] || "Not Selected";
                text += `\nOnline: ${state}`;
            }
            text += `\n\n`;
        });
        
        if (storage.system["No ONT Warning"]) {
            text += `No ONT on Customer Calix Cloud\n\n`;
        }
    }
  }

  if (shouldShowService(storage.service)) {
    text += "--- SERVICE INFO ---\n";
    for (const [key, val] of Object.entries(storage.service)) text += `${key}: ${val}\n`;
  }
  
  text += "\n--- ALARM HISTORY ---\n";
  
  if (storage.dateRange && storage.dateRange !== "Unknown Range") {
      text += `Range: ${storage.dateRange}\n`;
  }
  
  let hasManualAlarms = false;
  let totalAlarms = 0;
  
  const inputs = document.querySelectorAll(".alarm-input");
  inputs.forEach(input => {
      const val = parseInt(input.value) || 0;
      if (val > 0) {
          hasManualAlarms = true;
          totalAlarms += val;
          const alarmName = input.getAttribute("data-alarm");
          text += `${alarmName}: ${val}`;
          
          if (ALARM_DEFINITIONS[alarmName]) {
              text += ` - ${ALARM_DEFINITIONS[alarmName]}`;
          }
          text += "\n";
      }
  });

  if (hasManualAlarms) {
      text += `\nTotal Alarms: ${totalAlarms}\n`;
  } else {
      text += "No alarms visible in chart.\n";
  }

  if (!text.trim()) text = "No data available to copy.";
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyBtn");
    const orig = btn.innerText;
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = orig, 2000);
  });
});

function shouldShowService(data) {
  if (!data) return false;
  const down = data["Download Speed"];
  if (!down || down.startsWith("0 ") || down === "0") return false;
  return true;
}

function renderUI() {
  const container = document.getElementById("auto-data");
  let html = "";
  if (storage.system) {
    html += `
      <div class="card">
        <div class="card-title">System & Hardware</div>
        ${createRow("ONT Status", storage.system["ONT Status"])}
        ${createRow("PON Status", storage.system["PON Status"])}
        ${createRow("ONT Rx", storage.system["ONT Rx Power"])}
        ${createRow("OLT Rx", storage.system["OLT Rx Power"])}
        <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #eee;">
           <div class="label" style="margin-bottom:8px;">Device Info:</div>
           <div id="device-list" style="font-size:12px; color:#333;">
    `;

    if (storage.system["Devices Found"] && Array.isArray(storage.system["Devices Found"])) {
        storage.system["Devices Found"].forEach(device => {
            if (device.isOnt) {
                html += `
                    <div style="margin-bottom: 8px;">
                        <b>${device.model}</b><br>${device.fsan}
                    </div>
                `;
            } else {
                let state = storage.deviceStates[device.fsan] || "";
                let color = state === "Yes" ? "#28a745" : (state === "No" ? "#d9534f" : "#333");
                let yesSelected = state === "Yes" ? "selected" : "";
                let noSelected = state === "No" ? "selected" : "";

                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; background: #fdfdfd; padding: 4px; border: 1px solid #f0f0f0; border-radius: 4px;">
                        <div>
                            <b>${device.model}</b><br>${device.fsan}
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: #777; font-weight: bold; margin-bottom: 2px; text-transform: uppercase;">Online?</div>
                            <select class="online-dropdown" data-fsan="${device.fsan}" style="font-size: 11px; padding: 2px 4px; border-radius: 3px; font-weight: bold; outline: none; border: 1px solid #ccc; color: ${color};">
                                <option value="" disabled ${!state ? "selected" : ""}>--</option>
                                <option value="Yes" style="color: #28a745;" ${yesSelected}>Yes</option>
                                <option value="No" style="color: #d9534f;" ${noSelected}>No</option>
                            </select>
                        </div>
                    </div>
                `;
            }
        });

        if (storage.system["No ONT Warning"]) {
             html += `<div style="color:#d9534f; font-weight:bold; margin-top:8px; border-top:1px solid #eee; padding-top:5px;">No ONT on Customer Calix Cloud</div>`;
        }
    } else {
        html += `None`;
    }

    html += `
           </div>
        </div>
      </div>
    `;
  }
  
  if (shouldShowService(storage.service)) {
    html += `
      <div class="card">
        <div class="card-title">Service & Speed</div>
        ${createRow("Download", storage.service["Download Speed"])}
        ${createRow("Upload", storage.service["Upload Speed"])}
      </div>
    `;
  }

  if (html === "") {
    html = `<div style="text-align:center; padding: 20px; color:#888;">Navigate to collect data...</div>`;
  }
  
  container.innerHTML = html;

  const dropdowns = document.querySelectorAll('.online-dropdown');
  dropdowns.forEach(dd => {
      dd.addEventListener('change', (e) => {
          const val = e.target.value;
          const fsan = e.target.getAttribute('data-fsan');
          storage.deviceStates[fsan] = val; 
          e.target.style.color = val === "Yes" ? "#28a745" : "#d9534f";
      });
  });
}

function createRow(label, value) {
  if (!value) return "";
  return `<div class="data-row"><span class="label">${label}:</span><span class="value">${value}</span></div>`;
}