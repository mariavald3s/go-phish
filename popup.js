const API_KEY = "YOUR_URLSCAN_API_KEY"; // Replace this securely later

document.getElementById("scanBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract_urls" }, async (response) => {
      const urls = response.urls;
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      for (let url of urls) {
        const res = await fetch("https://urlscan.io/api/v1/scan/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "API-Key": API_KEY
          },
          body: JSON.stringify({ url, visibility: "unlisted" })
        });

        const data = await res.json();
        const link = document.createElement("a");
        link.href = data.result;
        link.target = "_blank";
        link.textContent = `Scanned: ${url}`;
        resultsDiv.appendChild(link);
        resultsDiv.appendChild(document.createElement("br"));
      }
    });
  });
});
