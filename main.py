import email
import time

import helpers
from dotenv import load_dotenv
import os

load_dotenv()
username = os.getenv("EMAIL_USER")
password = os.getenv("EMAIL_PASS").replace(" ", "")
api_key = os.getenv("URLSCAN_KEY")


imap = helpers.connect_email(username, password)

status, messages = imap.search(None, 'UNSEEN')
email_ids = messages[0].split()

for num in email_ids:
    res, msg = imap.fetch(num, "(RFC822)")
    for response in msg:
        if isinstance(response, tuple):
            email_message = email.message_from_bytes(response[1])
            urls = helpers.extract_urls_from_email(email_message)
            for url in urls:
                helpers.scan_url(url, api_key)
                time.sleep(5)  # Avoid rate limits

imap.logout()
