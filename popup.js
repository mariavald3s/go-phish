chrome.storage.local.set({ urlscanKey: "your-api-key" });


document.getElementById("scanBtn").addEventListener("click", () => {
  // Ask content script for URLs
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract_urls" }, (response) => {
      const urls = response?.urls || [];

      // Load API key from storage
      chrome.storage.local.get("urlscanKey", async (result) => {
        const apiKey = result.urlscanKey;
        if (!apiKey) {
          alert("API key not set. Please save one first.");
          return;
        }

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        for (const url of urls) {
          const res = await fetch("https://urlscan.io/api/v1/scan/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "API-Key": apiKey
            },
            body: JSON.stringify({ url, visibility: "unlisted" })
          });

          const data = await res.json();
          const link = document.createElement("a");
          link.href = data.result;
          link.textContent = `Scanned: ${url}`;
          link.target = "_blank";
          resultsDiv.appendChild(link);
          resultsDiv.appendChild(document.createElement("br"));
        }
      });
    });
  });
});
