SWANK FASHION STORE — STARTER WEBSITE
====================================

Is ZIP mein kya hai:
- Responsive fashion storefront (mobile + desktop)
- Demo product catalogue
- WhatsApp enquiry buttons
- Netlify Functions ke through Razorpay order creation + signature verification ka starter integration
- Policies page ka editable template

ZAROORI: Ye abhi STARTER/DEMO hai, live production store nahi.
Products, prices, photos, WhatsApp number, contact details, policies aur payment settings verify kiye bina live mat karein. Product photos demo/remote images hain.

NETLIFY PAR DEPLOY:
1. ZIP ko extract karein.
2. Netlify account mein "Add new site" / "Deploy manually" ya Git-connected deployment use karein. Netlify Functions aur npm dependency ke liye recommended: folder ko GitHub repository mein upload karke Netlify se repository import karein.
3. Build settings: Build command blank; Publish directory: . ; Functions directory: netlify/functions
4. package.json mein Razorpay dependency hai; Git-connected Netlify build par dependencies install ho sakti hain.
5. Netlify > Site configuration > Environment variables mein add karein:
   RAZORPAY_KEY_ID = aapki Razorpay Key ID
   RAZORPAY_KEY_SECRET = aapka Razorpay Key Secret
   SECRET ko kabhi frontend, HTML, GitHub public repo, WhatsApp ya screenshot mein share na karein.
6. Variables add/update karne ke baad redeploy karein.
7. Razorpay dashboard se pehle TEST keys use karein. Test payment successful ho aur server-side verification pass ho, tab hi live keys activate karein. Live payments ke liye Razorpay account/KYC/website approval aur settlement configuration required ho sakti hai.
8. script.js mein WHATSAPP_NUMBER ko country code ke saath real number se replace karein, jaise 91XXXXXXXXXX (plus sign ya spaces nahi).
9. script.js mein product names/prices/images aur netlify/functions/create-order.js ke catalog ko ek saath update karein. Server-side price catalogue authoritative hai.
10. policies.html mein actual shipping, return/refund, privacy, contact details daalein. India mein applicable legal/tax requirements apne business ke hisaab se check karein.

PAYMENT SAFETY:
- Key Secret sirf Netlify environment variables/server-side function mein rakhein.
- Order create karne ka price server-side catalogue se aata hai, browser se bheji price se nahi.
- Payment signature verify hoti hai. Ye starter abhi orders ko database mein save nahi karta, stock/delivery workflow nahi hai, aur webhook/reconciliation setup nahi hai. Real launch se pehle durable order database, Razorpay webhook verification, order emails, refund process, HTTPS/custom domain, product inventory, and legal policy review add karein.
- Payment success message ko shipping confirmation na samjhein; verified payment ke baad hi order fulfilment karein.

FREE PLAN NOTE:
Netlify free hosting se shuru kiya ja sakta hai, lekin free plan limits aur third-party payment provider fees/eligibility apply karte hain. Domain kharidna optional hai; custom domain aam taur par paid hota hai.
