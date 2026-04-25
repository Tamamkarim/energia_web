
function Home() {
  return (
    <div style={styles.page}>
        <header style={styles.navbar}>
          <h2 style={styles.logo}>Eco Energy Tracker</h2>
          <div>
            <button style={styles.loginBtn} onClick={() => (window.location.href = "/login")}> 
              Kirjaudu sisään
            </button>
            <button style={styles.registerBtn} onClick={() => (window.location.href = "/register")}> 
              Rekisteröidy
            </button>
          </div>
        </header>

        <section style={styles.hero}>
          <div style={styles.textBox}>
            <h1 style={styles.title}>Seuraa energiankulutustasi. Säästä ympäristöä.</h1>
            <p style={styles.description}>
              Eco Energy Tracker auttaa sinua seuraamaan sähkönkulutusta,
              ymmärtämään CO2-vaikutuksia, lataamaan sähkölaskuja
              ja saamaan vinkkejä energiansäästöön.
            </p>
            <button style={styles.ctaBtn} onClick={() => (window.location.href = "/register")}> 
              Aloita nyt
            </button>
          </div>
          <div style={styles.imageBox}>
            <img
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
              alt="Renewable energy"
              style={styles.image}
            />
          </div>
        </section>

        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>Ominaisuudet</h2>
          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>📊 Energiakaaviot</h3>
              <p>Seuraa sähkönkulutustasi selkeillä kaavioilla.</p>
            </div>
            <div style={styles.card}>
              <h3>🌱 CO2-vaikutus</h3>
              <p>Ymmärrä energiankulutuksen ympäristövaikutukset.</p>
            </div>
            <div style={styles.card}>
              <h3>📁 Tiedostojen lataus</h3>
              <p>Lataa sähkölaskut ja hallitse niitä yhdessä paikassa.</p>
            </div>
            <div style={styles.card}>
              <h3>💡 Älykkäät vinkit</h3>
              <p>Saa hyödyllisiä vinkkejä energiansäästöön.</p>
            </div>
          </div>
        </section>
        <section style={styles.adBox}>
          <h2>Aloita energiansäästö jo tänään!</h2>
          <p>
            Pienet muutokset energiankäytössä voivat vähentää kustannuksia
            ja tukea kestävää kehitystä.
          </p>
          <button style={styles.ctaBtn} onClick={() => (window.location.href = "/register")}> 
            Luo ilmainen tili
          </button>
        </section>
      </div>
    );
  }

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f8f4",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 50px",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logo: {
    color: "#1b5e20",
    margin: 0,
  },
  loginBtn: {
    padding: "10px 18px",
    marginRight: "10px",
    border: "1px solid #2e7d32",
    background: "white",
    color: "#2e7d32",
    borderRadius: "8px",
    cursor: "pointer",
  },
  registerBtn: {
    padding: "10px 18px",
    border: "none",
    background: "#2e7d32",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 50px",
    gap: "40px",
    flexWrap: "wrap",
  },
  textBox: {
    maxWidth: "550px",
  },
  title: {
    fontSize: "46px",
    color: "#1b5e20",
    marginBottom: "20px",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#444",
  },
  ctaBtn: {
    marginTop: "20px",
    padding: "14px 24px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  imageBox: {
    flex: "1",
    minWidth: "300px",
  },
  image: {
    width: "100%",
    maxHeight: "380px",
    objectFit: "cover",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  features: {
    padding: "40px 50px",
  },
  sectionTitle: {
    textAlign: "center",
    color: "#1b5e20",
    marginBottom: "30px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  adBox: {
    margin: "40px 50px",
    padding: "40px",
    textAlign: "center",
    background: "#dcedc8",
    borderRadius: "18px",
    color: "#1b5e20",
  },
};

export default Home;