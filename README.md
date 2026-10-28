KRYPTOWNIC CONSULTANTS - Android Mobile App (PWA)
=================================================
President: Thato Charles Mapaesa
Company: Kryptownic Consultants (Pty) Ltd (Reg: 2026/987654/07)
Built: Progressive Web App (PWA) - Installable on Android

CONTENTS
--------
  index.html           - Main app page (all sections)
  manifest.json        - PWA configuration (app name, icons, theme)
  service-worker.js    - Offline support & push notifications
  assets/css/styles.css - App styling (black/gold/white theme)
  assets/js/app.js     - App logic (forms, navigation, storage)
  assets/icons/        - App icons (72x72 through 512x512 + maskable)

HOW TO INSTALL ON ANDROID (HOME SCREEN)
|---------------------------------------
The app includes a manual "Install App" button in the header (top right).
It appears automatically when Chrome detects the PWA is installable.

Option 1 - Using the Install Button (easiest):
  1. Host the app locally or open index.html in Chrome on Android
  2. Look for the "Install App" button in the top-right header
  3. Tap "Install App" -> Chrome prompts to add to home screen
  4. Tap "Add" -> App icon appears on your home screen with the Kryptownic logo

Option 2 - Using Chrome Browser:
  1. Host the app locally: python -m http.server 8000
  2. On your phone, connect to: http://[YOUR-IP]:8000
  3. If no Install button appears, tap Chrome's 3-dot menu -> "Add to Home screen"
  4. Tap "Add" -> The app installs as a real app on your home screen

Option 3 - Direct file access:
  1. Copy the entire "Kryptownic_Consultants_App" folder to your Android phone
  2. Open index.html in Chrome
  3. Tap the 3-dot menu -> "Add to Home screen" -> "Add"
  4. Tap the icon on your home screen -> Opens in fullscreen (true app experience)

HOW TO SERVE LOCALLY (WINDOWS)
------------------------------
  Open Command Prompt in this folder and run:
    python -m http.server 8000
  Then visit http://localhost:8000 on any device on the same network

OR USING A SIMPLE PYTHON SCRIPT:
  python -c "
  import http.server, socketserver
  PORT = 8000
  Handler = http.server.SimpleHTTPRequestHandler
  httpd = socketserver.TCPServer(('', PORT), Handler)
  print(f'Serving on http://localhost:{PORT}')
  httpd.serve_forever()
  "

SERVICES
--------
  1. Business Consulting - Strategic advisory, operational improvement, organisational transformation
  2. Business Mentorship - Personalised mentorship for entrepreneurs and executives
  3. Consulting Services - Specialised consulting across industries
  4. Market Research - Consumer behaviour, competitive intelligence, market analysis
  5. Data Analysis - Statistical analysis, business intelligence, predictive modelling

CLIENT PORTAL
-------------
  Clients can send:
    - Queries / Enquiries
    - Comments
    - Questions
  Select the relevant service, enter your details, and submit.
  Messages are saved locally and can be viewed in the "Messages" section.

THEME
-----
  Primary:  Black (#000000)
  Accent:   Gold (#D4AF37)
  Text:     White (#FFFFFF)
  Matches the Kryptownic logo design (black, gold, white, Art Deco aesthetic)

PRESIDENT
---------
  Thato Charles Mapaesa
  President, Kryptownic Consultants (Pty) Ltd

NOTES
-----
  - This is a Progressive Web App (PWA), not a native APK
  - PWAs are a Google-recommended approach for Android apps
  - No Android SDK or compilation required
  - Works offline after first load
  - Can receive push notifications (when server-side push is configured)
  - Messages are stored in browser localStorage by default
