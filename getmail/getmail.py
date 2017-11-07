import imaplib
import re
mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('email@gmail.com', 'pass')
import socket
import socks
import urllib2
import urllib
import cookielib
import random, string
import os
import time

def randomword(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

os.system('sudo proxychains4 node ipcheck.js')

os.system('sudo proxychains4 node ../index.js')
time.sleep(5)
os.system('sudo proxychains4 node ./request.js')
time.sleep(20)

with open("1234.txt") as f:
    for line in f:
        print(line)
    
mail.select("inbox")
result, data = mail.search(None, "ALL")

ids = data[0] 
id_list = ids.split() 
latest_email_id = id_list[-1] 


result, data = mail.fetch(latest_email_id, "(RFC822)")

raw_email = data[0][1] 


import re

urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', raw_email)

urle = urls[0]

urle2 = re.sub(r'.*=', '', urle)

print "the below should not be null"
print urle2
print "the above should not be null"

f = open("../verify.txt","w") 
f.write(urle2)
f.close()

os.system('sudo proxychains4 node ../index.js')
time.sleep(60)
os.system('sudo proxychains4 node ./reques2.js')
