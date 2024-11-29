let currentIpType = 'ipv4';
let ipData = {
    ipv4: null,
    ipv6: null
};

// Cache DOM elements
const domElements = {
    ipv4: document.getElementById('ipv4'),
    ipv6: document.getElementById('ipv6'),
    tableIp: document.getElementById('table-ip'),
    tableCity: document.getElementById('table-city'),
    tableRegion: document.getElementById('table-region'),
    tableRegionCode: document.getElementById('table-region-code'),
    tableCountry: document.getElementById('table-country'),
    tableCountryCode: document.getElementById('table-country-code'),
    tableNetwork: document.getElementById('table-network'),
    tableAsn: document.getElementById('table-asn'),
    tableOrg: document.getElementById('table-org'),
    tableBrowser: document.getElementById('table-browser'),
    tablePlatform: document.getElementById('table-platform'),
    tableOs: document.getElementById('table-os'),
    tableUa: document.getElementById('table-ua')
};

// Constants
const API_ENDPOINTS = {
    IP_API: 'https://api.ipify.org?format=json',
    IP6_API: 'https://api64.ipify.org?format=json',
    DETAILS_API: 'https://ipapi.co',
    WHOIS_API: 'https://whois.freeaiapi.xyz'
};

function isValidIPv6(ip) {
    return ip && ip.includes(':');
}

function isValidDomain(input) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(input);
}

function resetTableToLoading() {
    const loadingText = 'Loading...';
    Object.values(domElements).forEach(element => {
        if (element && element.id.startsWith('table-')) {
            element.textContent = loadingText;
        }
    });
}

function resetTableToError() {
    const errorText = 'Error';
    Object.values(domElements).forEach(element => {
        if (element && element.id.startsWith('table-')) {
            element.textContent = errorText;
        }
    });
}

async function copyToClipboard(type) {
    const text = domElements[type].textContent;
    if (text === 'Not available' || text === 'Error fetching IP') {
        alert('No IP address available to copy');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        const button = document.querySelector(`#${type}-box .copy-btn`);
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy text');
    }
}

async function showDetails(type) {
    if (document.querySelector(`#${type}-box .detail-btn`).disabled) {
        return;
    }

    document.querySelector(`#${currentIpType}-box .detail-btn`).classList.remove('active');
    document.querySelector(`#${type}-box .detail-btn`).classList.add('active');
    
    currentIpType = type;
    const ip = ipData[type];
    
    if (!ip) {
        domElements.tableIp.textContent = 'No IP available';
        resetTableToError();
        return;
    }
    
    await fetchIPDetails(ip);
}

async function fetchIPDetails(ip) {
    try {
        resetTableToLoading();
        const response = await fetch(`${API_ENDPOINTS.DETAILS_API}/${ip}/json`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        updateIPDetails(data);
        updateBrowserInfo();
    } catch (error) {
        console.error('Error fetching IP details:', error);
        resetTableToError();
    }
}

function updateIPDetails(data) {
    domElements.tableIp.textContent = data.ip || 'N/A';
    domElements.tableCity.textContent = data.city || 'N/A';
    domElements.tableRegion.textContent = data.region || 'N/A';
    domElements.tableRegionCode.textContent = data.region_code || 'N/A';
    domElements.tableCountry.textContent = data.country_name || 'N/A';
    domElements.tableCountryCode.textContent = data.country_code || 'N/A';
    domElements.tableNetwork.textContent = data.network || 'N/A';
    domElements.tableAsn.textContent = data.asn || 'N/A';
    domElements.tableOrg.textContent = data.org || 'N/A';
}

function updateBrowserInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const browserInfo = getBrowserInfo(ua);

    domElements.tableBrowser.textContent = browserInfo.browser;
    domElements.tablePlatform.textContent = platform;
    domElements.tableOs.textContent = browserInfo.os;
    domElements.tableUa.textContent = ua;
}

function getBrowserInfo(ua) {
    const browsers = {
        'Chrome': /Chrome\/(\d+)/,
        'Firefox': /Firefox\/(\d+)/,
        'Safari': /Safari\/(\d+)/,
        'Edge': /Edg\/(\d+)/,
        'Opera': /OPR\/(\d+)/
    };

    const os = {
        'Windows': /Windows NT (\d+\.\d+)/,
        'Mac': /Mac OS X (\d+[._]\d+)/,
        'Linux': /Linux/,
        'iOS': /iPhone OS (\d+)/,
        'Android': /Android (\d+)/
    };

    let browserName = 'Unknown';
    let osName = 'Unknown';

    for (const [name, regex] of Object.entries(browsers)) {
        if (regex.test(ua)) {
            browserName = `${name} ${ua.match(regex)[1]}`;
            break;
        }
    }

    for (const [name, regex] of Object.entries(os)) {
        if (regex.test(ua)) {
            const match = ua.match(regex);
            osName = match[1] ? `${name} ${match[1].replace('_', '.')}` : name;
            break;
        }
    }

    return { browser: browserName, os: osName };
}

async function fetchIP() {
    try {
        const [ipv4Response, ipv6Response] = await Promise.allSettled([
            fetch(API_ENDPOINTS.IP_API),
            fetch(API_ENDPOINTS.IP6_API)
        ]);

        if (ipv4Response.status === 'fulfilled') {
            const ipv4Data = await ipv4Response.value.json();
            domElements.ipv4.textContent = ipv4Data.ip;
            ipData.ipv4 = ipv4Data.ip;
        } else {
            handleIPError();
        }

        if (ipv6Response.status === 'fulfilled') {
            const ipv6Data = await ipv6Response.value.json();
            domElements.ipv6.textContent = ipv6Data.ip;
            ipData.ipv6 = ipv6Data.ip;
        } else {
            domElements.ipv6.textContent = 'Not available';
        }

        await fetchIPDetails(ipData.ipv4);
    } catch (error) {
        console.error('Error fetching IPs:', error);
        handleIPError();
    }
}

async function searchIP() {
    const searchInput = document.getElementById('ip-search');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter an IP or domain');
        return;
    }

    resetTableToLoading();
    domElements.ipv4.textContent = 'Loading...';
    domElements.ipv6.textContent = 'Loading...';

    if (isValidDomain(query)) {
        await fetchDomainWhois(query);
    } else {
        await handleIPSearch(query);
    }
}

async function fetchDomainWhois(domain) {
    try {
        const response = await fetch(`${API_ENDPOINTS.WHOIS_API}/?domain=${domain}`);
        const data = await response.json();

        domElements.ipv4.textContent = 'Domain Lookup';
        domElements.ipv6.textContent = domain;

        document.querySelectorAll('.detail-btn').forEach(btn => btn.disabled = true);

        updateWhoisInfo(data, domain);
    } catch (error) {
        console.error('Error fetching domain info:', error);
        resetTableToError();
        domElements.ipv4.textContent = 'Error fetching domain info';
        domElements.ipv6.textContent = 'Error';
    }
}

function updateWhoisInfo(data, domain) {
    domElements.tableIp.textContent = domain;
    domElements.tableCity.textContent = data.registrar || 'N/A';
    domElements.tableRegion.textContent = data.creation_date || 'N/A';
    domElements.tableRegionCode.textContent = data.expiration_date || 'N/A';
    domElements.tableCountry.textContent = data.registrant_country || 'N/A';
    domElements.tableCountryCode.textContent = data.registrant_country_code || 'N/A';
    domElements.tableNetwork.textContent = data.name_servers?.join(', ') || 'N/A';
    domElements.tableAsn.textContent = data.dnssec || 'N/A';
    domElements.tableOrg.textContent = data.registrant_organization || 'N/A';
    domElements.tableBrowser.textContent = 'N/A';
    domElements.tablePlatform.textContent = 'N/A';
    domElements.tableOs.textContent = 'N/A';
    domElements.tableUa.textContent = 'N/A';
}

async function handleIPSearch(ip) {
    const isIPv6 = isValidIPv6(ip);
    const type = isIPv6 ? 'ipv6' : 'ipv4';

    domElements.ipv4.textContent = isIPv6 ? 'Not available' : ip;
    domElements.ipv6.textContent = isIPv6 ? ip : 'Not available';

    const ipv4Btn = document.querySelector('#ipv4-box .detail-btn');
    const ipv6Btn = document.querySelector('#ipv6-box .detail-btn');
    
    ipv4Btn.disabled = isIPv6;
    ipv6Btn.disabled = !isIPv6;
    
    ipv4Btn.classList.remove('active');
    ipv6Btn.classList.remove('active');
    document.querySelector(`#${type}-box .detail-btn`).classList.add('active');

    ipData = {
        ipv4: isIPv6 ? null : ip,
        ipv6: isIPv6 ? ip : null
    };
    
    currentIpType = type;
    await fetchIPDetails(ip);
}

function handleIPError() {
    domElements.ipv4.textContent = 'Error fetching IP';
    domElements.ipv6.textContent = 'Error fetching IP';
    resetTableToError();
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchIP);
document.getElementById('ip-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchIP();
    }
});
