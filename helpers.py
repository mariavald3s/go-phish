import imaplib
from email.header import decode_header
import re

import requests


def connect_email(username, password):
    imap = imaplib.IMAP4_SSL("imap.gmail.com")
    imap.login(username, password)
    imap.select("inbox")
    return imap

def extract_urls_from_email(email_message):
    urls = []
    for part in email_message.walk():
        if part.get_content_type() == "text/plain":
            body = part.get_payload(decode=True).decode(errors='ignore')
            urls.extend(re.findall(r'(https?://\S+)', body))
    return urls

def scan_url(url, api_key):
    headers = {'API-Key': api_key, 'Content-Type': 'application/json'}
    data = {"url": url, "visibility": "unlisted"}
    response = requests.post("https://urlscan.io/api/v1/scan/", json=data, headers=headers)
    if response.status_code == 200:
        scan_data = response.json()
        result_url = scan_data.get("result")
        print(f"Submitted: {url} — View result at: {result_url}")
        return result_url
    else:
        print(f"Error scanning {url}: {response.text}")
        return None
