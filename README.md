# Eco Energy Tracker

## Projektin Yleiskuvaus

Eco Energy Tracker on full stack -verkkosovellus, jonka avulla käyttäjät voivat seurata sähkönkulutustaan, ymmärtää ympäristövaikutuksia (CO2) ja arvioida kuukausittaista sähkölaskuaan.

Järjestelmä mahdollistaa myös sähkölaskujen lataamisen, tietojen visualisoinnin kaavioilla sekä älykkäiden energiansäästövinkkien saamisen.

---

## 🎯 Kohderyhmä

- Opiskelijat ja nuoret aikuiset
- Kotitaloudet, jotka hallitsevat sähkökustannuksia
- Käyttäjät, jotka haluavat vähentää energiankulutusta

---

## Käytetyt Teknologiat

### Frontend
- React.js (SPA)
- Chart.js
- jsPDF (laskujen luontiin)

### Backend
- Node.js
- Express.js (REST API)

### Tietokanta
- MariaDB

### Muut työkalut
- JWT-autentikointi
- Multer (tiedostojen lataus)
- Ulkoinen API (sähkön hinta – Suomi)

---

## Ominaisuudet

### Käyttäjähallinta *
- Rekisteröityminen ja kirjautuminen
- JWT-autentikointi
- Suojatut reitit

### Energiankulutuksen seuranta *
- Lisää, muokkaa, poista kulutustietoja
- Näe kokonaiskulutus
- CO2-laskenta

### Datan visualisointi *
- Pylväsdiagrammi energiankulutuksesta
- Ympyrädiagrammi huippu- ja hiljaisista ajoista
- Tietueiden vertailu

### Tiedostojen lataus *
- Lataa sähkölaskuja
- Näe ladatut tiedostot

### Laskutusjärjestelmä
- Automaattinen kuukausilaskun laskenta
- Sähkön hinnan integrointi
- Lataa lasku PDF-muodossa
- Laskun numero, yrityksen nimi, eräpäivä

### Ylläpitäjän hallintapaneeli
- Näe kaikki käyttäjät
- Näe kaikki energiankulutustiedot
- Roolipohjainen käyttöoikeus

---

## Tietokantarakenne

### Käyttäjät-taulu
- id
- nimi
- sähköposti
- salasana
- rooli

### Energiatiedot
- id
- user_id
- kulutus
- päivämäärä
- muistiinpanot

### Tiedostot
- id
- user_id
- tiedostopolku
- alkuperäinen_nimi
- mimetype

---

## Testaus

### Yksikkötestaus
- CO2-laskenta testattu Jestillä

### API-testaus
- Kirjautumisrajapinta testattu Supertestillä

### Käytettävyystestaus
- Testattu kolmella oikealla käyttäjällä
- Käyttäjät suorittivat onnistuneesti:
  - Kirjautuminen
  - Energiatietojen lisääminen
  - Kaavioiden tarkastelu
  - Tiedostojen lataus

---

## Ohjelmistoarkkitehtuuri

- Frontend kommunikoi backendin kanssa REST API:n kautta
- Backend yhdistyy MariaDB-tietokantaan
- Ulkoinen API käytössä sähkön todellisiin hintoihin

---

## Projektin Käynnistäminen

### 1. Kloonaa repositorio

```bash
git clone https://github.com/your-username/energia_web.git