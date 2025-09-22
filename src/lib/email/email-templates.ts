// Professional HTML email templates with University Ecom branding

export interface EmailTemplateData {
  firstName: string
  lastName?: string
  email: string
  [key: string]: any
}

export class EmailTemplates {
  
  // Base template with University Ecom branding
  private static getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University Ecom</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: #000000; padding: 40px 20px; text-align: center; }
        .logo { color: #ffffff; font-size: 24px; font-weight: bold; }
        .content { padding: 40px 20px; }
        .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
        .button { display: inline-block; background: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .button:hover { background: #333333; }
        .button-secondary { background: #6c757d; }
        .button-secondary:hover { background: #5a6268; }
        h1 { color: #000000; margin-bottom: 20px; font-size: 28px; }
        h2 { color: #000000; margin-bottom: 16px; font-size: 24px; }
        h3 { color: #000000; margin-bottom: 12px; font-size: 20px; }
        p { margin-bottom: 16px; color: #666666; }
        .highlight { background: #f8f9fa; padding: 20px; border-left: 4px solid #000000; margin: 20px 0; border-radius: 4px; }
        .success { background: #d4edda; border-color: #28a745; color: #155724; }
        .warning { background: #fff3cd; border-color: #ffc107; color: #856404; }
        .error { background: #f8d7da; border-color: #dc3545; color: #721c24; }
        .info { background: #d1ecf1; border-color: #17a2b8; color: #0c5460; }
        .social { margin: 20px 0; }
        .social a { margin: 0 10px; color: #666666; text-decoration: none; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #000000; }
        .stat-label { font-size: 14px; color: #666666; }
        .feature-list { list-style: none; }
        .feature-list li { padding: 8px 0; color: #666666; }
        .feature-list li:before { content: "✓ "; color: #28a745; font-weight: bold; margin-right: 8px; }
        @media (max-width: 600px) {
            .container { width: 100% !important; }
            .header, .content, .footer { padding: 20px !important; }
            h1 { font-size: 24px !important; }
            h2 { font-size: 20px !important; }
            .stats { flex-direction: column; }
            .stat { margin-bottom: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 University Ecom</div>
            <p style="color: #cccccc; margin-top: 10px; font-size: 14px;">AI & Dropshipping Kurse für Unternehmer</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p style="font-size: 14px; color: #666666; margin-bottom: 15px;">
                <strong>University Ecom</strong><br>
                Professionelle AI & Dropshipping Kurse für Europa
            </p>
            <div class="social">
                <a href="https://university-ecom.com">Website</a>
                <a href="mailto:support@university-ecom.com">Support</a>
                <a href="https://university-ecom.com/privacy">Datenschutz</a>
            </div>
            <p style="font-size: 12px; color: #999999; margin-top: 20px;">
                Sie erhalten diese E-Mail, weil Sie sich für unsere Kurse interessiert haben.<br>
                Falls Sie keine weiteren E-Mails wünschen: <a href="{{unsubscribeUrl}}" style="color: #999999;">Hier abmelden</a>
            </p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Intake confirmation template
  static getIntakeConfirmationTemplate(data: EmailTemplateData): { subject: string, html: string, text: string } {
    const content = `
      <h1>Vielen Dank für Ihr Interesse, ${data.firstName}! 🎉</h1>
      
      <p>Wir haben Ihre ausführlichen Antworten erhalten und sind beeindruckt von Ihrem Engagement. Unser Expertenteam wird diese nun sorgfältig prüfen.</p>
      
      <div class="highlight">
        <h3>Wie geht es weiter?</h3>
        <ul class="feature-list">
          <li><strong>Schritt 1:</strong> Prüfung Ihrer Antworten (24-48 Stunden)</li>
          <li><strong>Schritt 2:</strong> Persönliche Bewertung durch unser Team</li>
          <li><strong>Schritt 3:</strong> Rückmeldung mit nächsten Schritten</li>
        </ul>
      </div>
      
      <p>Sie haben großartiges Interesse an <strong>praktischem Wissen</strong> gezeigt. Genau das schätzen wir bei University Ecom - keine Theorie, sondern anwendbare Strategien für echten Erfolg.</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number">95%</div>
          <div class="stat-label">Erfolgsquote</div>
        </div>
        <div class="stat">
          <div class="stat-number">24h</div>
          <div class="stat-label">Antwortzeit</div>
        </div>
        <div class="stat">
          <div class="stat-number">500+</div>
          <div class="stat-label">Erfolgreiche Absolventen</div>
        </div>
      </div>
      
      <div class="highlight info">
        <p><strong>💡 Tipp:</strong> Nutzen Sie die Wartezeit, um sich auf unserer Website über die Kursinhalte zu informieren. So können Sie optimal vorbereitet starten!</p>
      </div>
      
      <a href="https://university-ecom.com/courses" class="button">Kurse entdecken</a>
      
      <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Unser Support-Team antwortet innerhalb weniger Stunden.</p>
      
      <p>Beste Grüße<br>
      <strong>Ihr University Ecom Team</strong></p>
    `

    return {
      subject: `Vielen Dank für Ihr Interesse, ${data.firstName}! Ihre Antworten werden geprüft 📋`,
      html: this.getBaseTemplate(content),
      text: `Vielen Dank für Ihr Interesse, ${data.firstName}!\n\nWir haben Ihre Antworten erhalten und werden diese innerhalb von 24-48 Stunden prüfen. Sie erhalten eine E-Mail mit unserer Entscheidung und den nächsten Schritten.\n\nBei Fragen: support@university-ecom.com\n\nBeste Grüße\nIhr University Ecom Team`
    }
  }

  // Intake approved template
  static getIntakeApprovedTemplate(data: EmailTemplateData & { reviewNotes?: string, coursesInterested?: string[] }): { subject: string, html: string, text: string } {
    const content = `
      <h1>Herzlichen Glückwunsch, ${data.firstName}! 🎉</h1>
      
      <div class="highlight success">
        <h3>Sie sind qualifiziert! ✅</h3>
        <p>Nach sorgfältiger Prüfung Ihrer Antworten freuen wir uns, Ihnen mitteilen zu können, dass <strong>Sie für unsere Kurse qualifiziert sind</strong>.</p>
      </div>
      
      <p>Ihr Engagement und Ihre klaren Ziele haben uns überzeugt. Sie zeigen genau die Einstellung, die für den Erfolg in unserem Programm erforderlich ist.</p>
      
      ${data.reviewNotes ? `
        <div class="highlight">
          <h3>Persönliche Bewertung unseres Teams:</h3>
          <p><em>"${data.reviewNotes}"</em></p>
        </div>
      ` : ''}
      
      <h2>Ihre nächsten Schritte:</h2>
      <div class="highlight">
        <ul class="feature-list">
          <li><strong>Kurs auswählen:</strong> Entscheiden Sie sich für den optimalen Kurs</li>
          <li><strong>Plan wählen:</strong> Pro Plan (€497) oder Max Plan (€997)</li>
          <li><strong>Sofort starten:</strong> Direkter Zugang nach der Anmeldung</li>
        </ul>
      </div>
      
      <h3>🚀 Warum Sie mit uns erfolgreich werden:</h3>
      <ul class="feature-list">
        <li><strong>Praxiserprobte Strategien</strong> - Keine Theorie, nur was funktioniert</li>
        <li><strong>GDPR-konforme Ansätze</strong> - Speziell für den europäischen Markt</li>
        <li><strong>1-zu-1 Betreuung</strong> - Persönlicher Support bei Fragen</li>
        <li><strong>Community-Zugang</strong> - Austausch mit erfolgreichen Unternehmern</li>
        <li><strong>Lebenslanger Zugang</strong> - Alle Updates inklusive</li>
      </ul>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number">3-6</div>
          <div class="stat-label">Monate bis zum Erfolg</div>
        </div>
        <div class="stat">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Zugang zu Inhalten</div>
        </div>
        <div class="stat">
          <div class="stat-number">∞</div>
          <div class="stat-label">Lebenslang gültig</div>
        </div>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://university-ecom.com/courses" class="button">Jetzt Kurs wählen</a>
        <br>
        <a href="https://university-ecom.com/pricing" class="button-secondary" style="display: inline-block; background: #6c757d; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 10px;">Preise vergleichen</a>
      </p>
      
      <div class="highlight info">
        <p><strong>🎯 Spezialangebot für qualifizierte Bewerber:</strong><br>
        Wenn Sie sich innerhalb der nächsten 7 Tage anmelden, erhalten Sie zusätzliche Boni im Wert von €200!</p>
      </div>
      
      <p>Wir freuen uns darauf, Sie auf Ihrem Weg zum Erfolg zu begleiten!</p>
      
      <p>Beste Grüße<br>
      <strong>Ihr University Ecom Team</strong></p>
    `

    return {
      subject: `Herzlichen Glückwunsch, ${data.firstName}! Sie sind qualifiziert! 🎉`,
      html: this.getBaseTemplate(content),
      text: `Herzlichen Glückwunsch, ${data.firstName}!\n\nSie sind für unsere Kurse qualifiziert! Nach Prüfung Ihrer Antworten sind wir überzeugt, dass Sie die richtige Einstellung für den Erfolg mitbringen.\n\n${data.reviewNotes ? `Bewertung: ${data.reviewNotes}\n\n` : ''}Nächste Schritte:\n1. Kurs auswählen\n2. Plan wählen (Pro €497 oder Max €997)\n3. Sofort starten\n\nJetzt anmelden: https://university-ecom.com/courses\n\nBeste Grüße\nIhr University Ecom Team`
    }
  }

  // Intake rejected template  
  static getIntakeRejectedTemplate(data: EmailTemplateData & { reviewNotes?: string }): { subject: string, html: string, text: string } {
    const content = `
      <h1>Vielen Dank für Ihr Interesse, ${data.firstName}!</h1>
      
      <p>Wir haben Ihre Antworten sorgfältig geprüft und sind dankbar für das Vertrauen, das Sie uns entgegengebracht haben.</p>
      
      <div class="highlight warning">
        <h3>Unsere Entscheidung</h3>
        <p>Nach eingehender Prüfung müssen wir Ihnen leider mitteilen, dass unsere Kurse <strong>derzeit nicht optimal für Ihre spezifische Situation geeignet</strong> sind.</p>
      </div>
      
      ${data.reviewNotes ? `
        <div class="highlight">
          <h3>Feedback unseres Teams:</h3>
          <p><em>"${data.reviewNotes}"</em></p>
        </div>
      ` : ''}
      
      <p>Diese Entscheidung bedeutet nicht, dass Sie nicht erfolgreich sein können. Es zeigt nur, dass der Zeitpunkt oder die Ausrichtung möglicherweise noch nicht perfekt passt.</p>
      
      <h3>💡 Unsere Empfehlungen für Sie:</h3>
      <ul class="feature-list">
        <li>Sammeln Sie zunächst mehr praktische Erfahrung in Ihrem Bereich</li>
        <li>Definieren Sie Ihre Ziele noch konkreter</li>
        <li>Bewerben Sie sich gerne in 3-6 Monaten erneut</li>
      </ul>
      
      <div class="highlight info">
        <h3>🎯 Kostenlose Ressourcen für Sie:</h3>
        <ul class="feature-list">
          <li>Zugang zu unserem Newsletter mit wertvollen Tipps</li>
          <li>Kostenlose E-Books und Guides</li>
          <li>Einladung zu unseren Webinaren</li>
        </ul>
      </div>
      
      <p style="text-align: center;">
        <a href="https://university-ecom.com/newsletter" class="button">Newsletter abonnieren</a>
      </p>
      
      <p>Wir wünschen Ihnen alles Gute auf Ihrem unternehmerischen Weg und stehen für Fragen jederzeit zur Verfügung.</p>
      
      <p>Beste Grüße<br>
      <strong>Ihr University Ecom Team</strong></p>
    `

    return {
      subject: `Ihre Bewerbung bei University Ecom - Nächste Schritte`,
      html: this.getBaseTemplate(content),
      text: `Vielen Dank für Ihr Interesse, ${data.firstName}!\n\nNach sorgfältiger Prüfung Ihrer Antworten müssen wir Ihnen leider mitteilen, dass unsere Kurse derzeit nicht optimal für Ihre Situation geeignet sind.\n\n${data.reviewNotes ? `Feedback: ${data.reviewNotes}\n\n` : ''}Das bedeutet nicht, dass Sie nicht erfolgreich sein können. Wir empfehlen, sich in 3-6 Monaten erneut zu bewerben.\n\nKostenlose Ressourcen: https://university-ecom.com/newsletter\n\nBeste Grüße\nIhr University Ecom Team`
    }
  }

  // Welcome sequence templates
  static getWelcomeSequenceTemplate(sequenceNumber: 1 | 2 | 3, data: EmailTemplateData & { courseName?: string }): { subject: string, html: string, text: string } {
    const templates = {
      1: {
        subject: `Willkommen bei University Ecom, ${data.firstName}! Ihr Erfolg beginnt jetzt 🚀`,
        content: `
          <h1>Willkommen in der University Ecom Familie, ${data.firstName}! 🎉</h1>
          
          <p>Sie haben den wichtigsten Schritt getan: <strong>Sie haben sich für praktisches Wissen entschieden</strong>. Herzlichen Glückwunsch zu dieser Investition in Ihre Zukunft!</p>
          
          <div class="highlight success">
            <h3>Sie haben Zugang zu:</h3>
            <ul class="feature-list">
              <li>Alle Kursinhalte sofort verfügbar</li>
              <li>Private WhatsApp Community</li>
              <li>1-zu-1 Support bei Fragen</li>
              <li>Lebenslange Updates</li>
            </ul>
          </div>
          
          <h3>🎯 Ihre ersten Schritte:</h3>
          <p>1. <strong>Loggen Sie sich ein:</strong> Ihr Kursbereich wartet auf Sie<br>
          2. <strong>Erstes Modul starten:</strong> Beginnen Sie mit den Grundlagen<br>
          3. <strong>Community beitreten:</strong> Vernetzen Sie sich mit anderen</p>
          
          <p style="text-align: center;">
            <a href="https://university-ecom.com/dashboard" class="button">Zum Kursbereich</a>
          </p>
          
          <div class="highlight info">
            <p><strong>💡 Tipp für maximalen Erfolg:</strong><br>
            Planen Sie täglich 30-60 Minuten für Ihren Kurs ein. Konstanz schlägt Intensität!</p>
          </div>
        `
      },
      2: {
        subject: `Tag 3: Ihre ersten Erfolge mit University Ecom 📈`,
        content: `
          <h1>Wie läuft es, ${data.firstName}? 📊</h1>
          
          <p>Vor 3 Tagen haben Sie Ihre Reise mit University Ecom begonnen. Zeit für ein erstes Check-in!</p>
          
          <div class="highlight">
            <h3>Häufige Fragen nach den ersten Tagen:</h3>
            <p><strong>Q:</strong> "Ich fühle mich überwältigt von den vielen Informationen."<br>
            <strong>A:</strong> Das ist völlig normal! Arbeiten Sie Schritt für Schritt durch die Module.</p>
            
            <p><strong>Q:</strong> "Wann sehe ich erste Ergebnisse?"<br>
            <strong>A:</strong> Die meisten Teilnehmer sehen erste Erfolge nach 2-4 Wochen konsequenter Umsetzung.</p>
          </div>
          
          <h3>🔥 Erfolgsgeschichte der Woche:</h3>
          <div class="highlight success">
            <p><em>"Nach nur 2 Wochen habe ich meine ersten €500 Online-Umsatz generiert. Die Strategien funktionieren wirklich!"</em><br>
            - Sarah M., Kursteilnehmerin</p>
          </div>
          
          <p>Falls Sie Fragen haben oder Unterstützung benötigen:</p>
          <p style="text-align: center;">
            <a href="mailto:support@university-ecom.com" class="button">Support kontaktieren</a>
          </p>
        `
      },
      3: {
        subject: `Woche 1 geschafft! Zeit für den Turbo, ${data.firstName} 🚀`,
        content: `
          <h1>Eine Woche University Ecom - Sie sind auf dem richtigen Weg! 🎯</h1>
          
          <p>Herzlichen Glückwunsch, ${data.firstName}! Sie haben Ihre erste Woche mit unserem Kurs gemeistert. Das zeigt Ihr Commitment!</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-number">7</div>
              <div class="stat-label">Tage geschafft</div>
            </div>
            <div class="stat">
              <div class="stat-number">∞</div>
              <div class="stat-label">Möglichkeiten vor Ihnen</div>
            </div>
          </div>
          
          <h3>🔥 Jetzt kommt der Turbo:</h3>
          <div class="highlight">
            <ul class="feature-list">
              <li>Setzen Sie das Gelernte in die Praxis um</li>
              <li>Dokumentieren Sie Ihre ersten Versuche</li>
              <li>Teilen Sie Erfahrungen in der Community</li>
              <li>Stellen Sie konkrete Fragen bei Problemen</li>
            </ul>
          </div>
          
          <div class="highlight success">
            <h3>💰 Erfolgs-Booster für Woche 2:</h3>
            <p>Konzentrieren Sie sich auf <strong>eine einzige Strategie</strong> und setzen Sie diese konsequent um. Perfektion kommt durch Wiederholung!</p>
          </div>
          
          <p style="text-align: center;">
            <a href="https://university-ecom.com/community" class="button">Zur Community</a>
          </p>
        `
      }
    }

    const template = templates[sequenceNumber]
    
    return {
      subject: template.subject,
      html: this.getBaseTemplate(template.content),
      text: `${template.subject}\n\nHallo ${data.firstName}!\n\n[Vereinfachte Textversion der E-Mail]\n\nBeste Grüße\nIhr University Ecom Team`
    }
  }

  // Support ticket templates
  static getSupportTicketTemplate(type: 'created' | 'resolved', data: EmailTemplateData & { ticketId: string, ticketSubject: string, response?: string }): { subject: string, html: string, text: string } {
    if (type === 'created') {
      const content = `
        <h1>Support-Ticket erstellt, ${data.firstName}!</h1>
        
        <p>Vielen Dank für Ihre Nachricht. Wir haben Ihr Support-Ticket erhalten und werden uns schnellstmöglich darum kümmern.</p>
        
        <div class="highlight">
          <h3>Ticket-Details:</h3>
          <p><strong>Ticket-ID:</strong> ${data.ticketId}<br>
          <strong>Betreff:</strong> ${data.ticketSubject}<br>
          <strong>Status:</strong> In Bearbeitung</p>
        </div>
        
        <p><strong>Unsere Antwortzeiten:</strong><br>
        • Allgemeine Fragen: Innerhalb von 4 Stunden<br>
        • Technische Probleme: Innerhalb von 2 Stunden<br>
        • Dringende Fälle: Innerhalb von 1 Stunde</p>
        
        <p>Sie erhalten eine E-Mail, sobald wir Ihr Anliegen bearbeitet haben.</p>
      `

      return {
        subject: `Support-Ticket #${data.ticketId} erhalten - Wir helfen Ihnen!`,
        html: this.getBaseTemplate(content),
        text: `Support-Ticket erstellt!\n\nTicket-ID: ${data.ticketId}\nBetreff: ${data.ticketSubject}\n\nWir bearbeiten Ihr Anliegen und melden uns schnellstmöglich.\n\nBeste Grüße\nIhr University Ecom Support`
      }
    } else {
      const content = `
        <h1>Ihr Support-Ticket wurde bearbeitet, ${data.firstName}!</h1>
        
        <div class="highlight success">
          <h3>Ticket gelöst ✅</h3>
          <p><strong>Ticket-ID:</strong> ${data.ticketId}<br>
          <strong>Betreff:</strong> ${data.ticketSubject}</p>
        </div>
        
        ${data.response ? `
          <div class="highlight">
            <h3>Antwort unseres Support-Teams:</h3>
            <p>${data.response}</p>
          </div>
        ` : ''}
        
        <p>Falls Sie weitere Fragen haben oder das Problem noch nicht vollständig gelöst ist, antworten Sie einfach auf diese E-Mail.</p>
        
        <p style="text-align: center;">
          <a href="mailto:support@university-ecom.com" class="button">Weitere Hilfe benötigt?</a>
        </p>
      `

      return {
        subject: `Ticket #${data.ticketId} gelöst - ${data.ticketSubject}`,
        html: this.getBaseTemplate(content),
        text: `Ihr Support-Ticket wurde gelöst!\n\nTicket-ID: ${data.ticketId}\n\n${data.response || 'Ihr Anliegen wurde bearbeitet.'}\n\nBei weiteren Fragen: support@university-ecom.com\n\nBeste Grüße\nIhr University Ecom Support`
      }
    }
  }
}
