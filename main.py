import imaplib
import email
from email.header import decode_header
import re

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
