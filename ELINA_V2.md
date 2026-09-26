# ELINA V2

ELINA wird bewusst einfacher aufgebaut: wenige Seiten, eine gemeinsame Gestaltung und ein einziges Warenkorb-System.

## Aktiver V2-Flow
1. Home
2. Shop
3. Produkt
4. Warenkorb
5. Test-Checkout
6. Bestellbestätigung

Der aktuelle Checkout ist absichtlich **nur Testmodus**. Es werden keine echten Zahlungsdaten erfasst, kein Geld belastet und keine Bestellung an Lieferanten gesendet.

## Technische Struktur
- `index.html` – Startseite
- `shop.html` – Kollektion
- `product1.html` bis `product3.html` – Produktseiten
- `warenkorb.html` – Warenkorb
- `checkout.html` – Test-Checkout
- `danke.html` – Bestätigung
- `style.css` – gesamtes Design
- `script.js` – gemeinsamer Warenkorb + Checkout-Logik
- `server.js` – kleine Test-API ohne Accounts

## Nächste Live-Stufe
Für echte Verkäufe werden später getrennt ergänzt:
- Zahlungsanbieter (z. B. Stripe) mit verifiziertem Kontoinhaber
- serverseitige Bestellung statt LocalStorage
- Lieferanten-API für automatische Aufträge
- Webhooks für Zahlung und Versandstatus
- Tracking-Mails
- Admin-Dashboard für Umsatz, Kosten, Marge und Bestellstatus
- Retouren- und Support-Workflow

Wichtig: Automatische Lieferantenbestellungen dürfen erst nach bestätigter echter Zahlung ausgelöst werden.