function extractUrlsFromEmail() {
  const emailBodies = document.querySelectorAll("div.a3s");
  const urls = new Set();

  emailBodies.forEach(div => {
    const text = div.innerText;
    const found = [...text.matchAll(/https?:\/\/[^\s"]+/g)];
    found.forEach(match => urls.add(match[0]));
  });

  return [...urls];
}

// Listen for popup request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_urls") {
    const urls = extractUrlsFromEmail();
    sendResponse({ urls });
  }
});
