تعليمات عامة عن المشروع
Tämä projekti on web-pohjainen sovellus, jonka tavoitteena on auttaa käyttäjiä seuraamaan ja ymmärtämään omaa energiankulutustaan. Sovellus mahdollistaa energiankulutustietojen lisäämisen, muokkaamisen ja poistamisen sekä datan visualisoinnin kaavioiden avulla.

Sovellus tukee myös tiedostojen lataamista (esim. sähkölaskut), jolloin käyttäjä voi hallita ja tarkastella omaa energiadataansa yhdessä paikassa.

Projektissa on hyödynnetty modernia web-teknologiaa, kuten React frontendissä ja Node.js + Express backendissä sekä MariaDB-tietokantaa.
🧑‍💻 2) Käyttöohje (User Instructions)
Käyttäjä voi käyttää sovellusta seuraavasti:

1. Rekisteröidy sovellukseen syöttämällä nimi, sähköposti ja salasana.
2. Kirjaudu sisään omilla tunnuksillasi.
3. Lisää energiankulutustietoja syöttämällä kulutus (kWh), päivämäärä ja mahdolliset muistiinpanot.
4. Tarkastele kulutusta visuaalisesti kaavioiden avulla.
5. Muokkaa tai poista aiemmin lisättyjä tietoja.
6. Lataa sähkölaskuja tai muita tiedostoja järjestelmään.
7. Etsi ja avaa ladattuja tiedostoja.
⚙️ 3) Tekninen toteutus
Sovellus on toteutettu full-stack-ratkaisuna:

Frontend:
- React (SPA)
- Chart.js kaavioiden visualisointiin

Backend:
- Node.js ja Express
- REST API

Tietokanta:
- MariaDB

Autentikointi:
- JSON Web Token (JWT)

Tiedostojen käsittely:
- Multer (file upload)
🔐 4) Tietoturva
Sovellus käyttää JWT-autentikointia käyttäjän tunnistamiseen. Salasanat tallennetaan tietokantaan hashattuina, mikä parantaa tietoturvaa. API-reitit on suojattu siten, että käyttäjä voi käsitellä vain omia tietojaan.
🌱 5) Kestävä kehitys (مهم جدًا لمشروعك)
Sovellus tukee kestävää kehitystä tarjoamalla käyttäjälle tietoa energiankulutuksesta ja sen ympäristövaikutuksista. Energiankulutus muunnetaan CO2-päästöiksi, mikä auttaa käyttäjää ymmärtämään kulutuksen vaikutuksia ympäristöön.

Tavoitteena on lisätä käyttäjän tietoisuutta ja kannustaa energiansäästöön.
📊 6) Käytettävyys (UX)
Käyttöliittymä on suunniteltu yksinkertaiseksi ja selkeäksi. Sovellus tarjoaa visuaalisia kaavioita, jotka helpottavat datan ymmärtämistä. Lisäksi sovellus toimii responsiivisesti eri laitteilla.
🚀 7) Jatkokehitys
Mahdollisia jatkokehitysideoita:

- Energiansäästövinkkien lisääminen
- Ilmoitukset kulutusrajojen ylityksestä
- Usean käyttäjän kotitalousnäkymä
- Dark mode
- Monikielisyyden laajentaminen