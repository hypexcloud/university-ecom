export const metadata = {
  title: 'Datenschutzerklärung - University Ecom',
  description: 'Datenschutzerklärung gemäß DSGVO von University Ecom.',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-8">
            Datenschutzerklärung
          </h1>
          <div className="accent-line-gold mb-12"></div>
          
          <div className="prose prose-invert prose-gold max-w-none">
            <div className="space-y-8 text-prestige-gray-300">
              <section>
                <h2 className="text-2xl font-display font-bold text-prestige-white mb-4">
                  1. Datenschutz auf einen Blick
                </h2>
                <h3 className="text-xl font-semibold text-prestige-gold-500 mb-3">
                  Allgemeine Hinweise
                </h3>
                <p className="mb-4">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                  Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-prestige-white mb-4">
                  2. Datenerfassung auf dieser Website
                </h2>
                <h3 className="text-xl font-semibold text-prestige-gold-500 mb-3">
                  Wer ist verantwortlich für die Datenerfassung auf dieser Website?
                </h3>
                <p className="mb-4">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
                  Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-prestige-gold-500 mb-3">
                  Wie erfassen wir Ihre Daten?
                </h3>
                <p className="mb-4">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                  es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="mb-4">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website 
                  durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, 
                  Betriebssystem oder Uhrzeit des Seitenaufrufs).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-prestige-white mb-4">
                  3. Hosting und Content Delivery Networks (CDN)
                </h2>
                <p className="mb-4">
                  Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
                </p>
                <h3 className="text-xl font-semibold text-prestige-gold-500 mb-3">
                  Vercel
                </h3>
                <p className="mb-4">
                  Anbieter ist die Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA 
                  (nachfolgend „Vercel").
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-prestige-white mb-4">
                  4. Allgemeine Hinweise und Pflichtinformationen
                </h2>
                <h3 className="text-xl font-semibold text-prestige-gold-500 mb-3">
                  Datenschutz
                </h3>
                <p className="mb-4">
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
                  Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen 
                  Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-prestige-white mb-4">
                  5. Ihre Rechte
                </h2>
                <p className="mb-4">
                  Sie haben jederzeit das Recht:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
                  <li>Berichtigung unrichtiger Daten zu verlangen</li>
                  <li>Löschung Ihrer Daten zu verlangen</li>
                  <li>Einschränkung der Verarbeitung zu verlangen</li>
                  <li>Datenübertragbarkeit zu verlangen</li>
                  <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                </ul>
              </section>

              <div className="bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-lg p-6 mt-12">
                <p className="text-prestige-gold-500 font-semibold mb-2">
                  ⚠️ Wichtiger Hinweis
                </p>
                <p className="text-prestige-gray-300 text-sm">
                  Dies ist eine Muster-Datenschutzerklärung. Für den produktiven Einsatz muss diese 
                  Datenschutzerklärung von einem Rechtsanwalt geprüft und an Ihre spezifischen 
                  Gegebenheiten angepasst werden. Nutzen Sie professionelle Generatoren wie 
                  eRecht24, Datenschutz-Generator.de oder lassen Sie sich rechtlich beraten.
                </p>
              </div>

              <p className="text-sm text-prestige-gray-500 mt-12">
                Zuletzt aktualisiert: Dezember 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
