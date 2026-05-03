import React from "react";

const styles = {
	page: {
		// ... أضف خصائص النمط هنا ...
	},
	navbar: {},
	logo: {},
	loginBtn: {},
	registerBtn: {},
	hero: {},
	textBox: {},
	title: {},
	description: {},
	ctaBtn: {},
	imageBox: {},
	image: {},
	features: {},
	sectionTitle: {},
	cards: {},
	card: {},
	adBox: {},
};

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
				</section>
		</div>
	);
}

export default Home;
