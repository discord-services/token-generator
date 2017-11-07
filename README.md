# token-generator
Discord token generator for running in headless systems such as VPSes and other types of headless servers.  
Often used to spam discord servers, if your system isn't headless, you can still use the code, but you might want to wait for the faster and no maintinance cost version for non-headless machines.

# REQUIREMENTS
## A DEBIAN BASED LINUX DISTRO IS REQUIRED
Node.js 6 or higher  
Python 2.7 or higher  
Proxychains-ng found in https://github.com/rofl0r/proxychains-ng  
Npm 1.4 or higher  
A custom domain, free domains such as .tk or others WON'T WORK!  
A zohomail account (This was the only free email hosting that i found that provides a catch all email address without configuring a catch all imap server in linux) (zoho.com/mail)
An anti-captcha account with some credits loaded on it for solving captchas (anti-captcha.com) this will probably be removed on the non-headless version, but headless servers and vpses need this for the code to work.  
A gmail account.  

# PREREQUISITES AND SETUP
  
### STEP 1: BUY A CUSTOM DOMAIN  
Buy a custom domain, this will later be used to create a custom disposable email address with zoho.com/mail.  
  
### STEP 2: CREATE A ZOHOMAIL ACCOUNT  
Create a zohomail account (This will be used for the catch-all email forwarding)  

### STEP 3: EDIT THE DOMAIN DNS RECORDS  
Edit the DNS records of the domain as instructed when you create your zohomail account.  

### STEP 4: SET UP EMAIL FORWARDING  
Add an email forwarder account as instructed here: https://www.zoho.eu/mail/help/email-forwarding.html  
Be sure to forward to the gmail account and verify it afterwards.  

### STEP 5: SET UP A CATCH ALL INSTRUCTION  
Set up catch all as instructed here: https://www.zoho.eu/mail/help/adminconsole/catch-all-setup.html  

### STEP 6: LOG IN  
Log in to the gmail account   

### STEP 7: TEST  
Test the catch all setup by sending an email to a nonsensical email address such as As38S8wdB7gein@domain.com  
Check your Gmail, if you do not recieve the email check that you have done everything above and submit an issue for support.   

### STEP 8: CONFIG 
Assuming you have created an account and deposited some money in anti-captcha.com get your api key and place it in the index.js file  
Put your gmail email and password in getmail/getmail.py  
Put your email domain (format = @domain.com) in getmail/request.js  
Put your anti-captcha token in index.js
Put your desired bot names in getmail/request.js in var names   

### STEP 9: PROXIES  
comment out strict_chain,  and proxy_dns with a # in /etc/proxychains.conf,  
uncomment random_chain and chain_len = 2 and change it to 1  
delete the socks4 127.0.0.1 9050 line  
and add your proxies below  

format should be  

format ip port  

example:  

socks5 192.168.1.1 1234

IMPORTANT: The proxies must be of good quality, proxies that time out reveal your ip address, i will try to fix this in later commits.

### STEP 10: NPM MODULES  
install these via sudo npm install <dependency>  
randomstring  
request  

if there are any other dependencies i missed or didn't remember just tyoe them in issues  
python dependencies are installed with sudo pip install <dependency>  
  
# RUN
to run the code simply go to the base directory and type ./run.sh or sudo bash run.sh  
to stop simply mash control c forever  
tokens and all responses are stored in tokens.txt, if there is an error it will sadly end up there as well 
(a txt file because of apperent problems in json)

