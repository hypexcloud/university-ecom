import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Crown, Mail, Phone, MessageSquare, Clock, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Erstgespräch buchen - University Ecom',
  description: 'Buchen Sie Ihr kostenloses Erstgespräch und finden Sie heraus, welcher Kurs am besten zu Ihnen passt.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero Section */}
      <section className="section-prestige px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl text-center">
          <Crown className="w-16 h-16 text-prestige-gold-500 mx-auto mb-6" />
          
          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Kostenloses <span className="text-gradient-gold">Erstgespräch</span>
          </h1>
          
          <div className="accent-line-gold mx-auto mb-6"></div>
          
          <p className="text-xl text-prestige-gray-300 max-w-3xl mx-auto">
            In einem persönlichen Gespräch finden wir heraus, welcher Kurs am besten zu Ihren Zielen passt und wie wir Sie zum Erfolg führen können.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Form */}
            <div>
              <Card className="card-prestige">
                <CardHeader>
                  <CardTitle className="text-2xl text-prestige-white">
                    Termin anfragen
                  </CardTitle>
                  <CardDescription className="text-prestige-gray-400">
                    Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-prestige-gray-300">
                          Vorname *
                        </Label>
                        <Input 
                          id="firstName" 
                          required 
                          className="bg-prestige-black border-prestige-gold-500/20 text-prestige-white focus:border-prestige-gold-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-prestige-gray-300">
                          Nachname *
                        </Label>
                        <Input 
                          id="lastName" 
                          required 
                          className="bg-prestige-black border-prestige-gold-500/20 text-prestige-white focus:border-prestige-gold-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-prestige-gray-300">
                        E-Mail *
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        className="bg-prestige-black border-prestige-gold-500/20 text-prestige-white focus:border-prestige-gold-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-prestige-gray-300">
                        Telefonnummer *
                      </Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required 
                        className="bg-prestige-black border-prestige-gold-500/20 text-prestige-white focus:border-prestige-gold-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course" className="text-prestige-gray-300">
                        Interessierter Kurs *
                      </Label>
                      <select 
                        id="course" 
                        required
                        className="w-full bg-prestige-black border border-prestige-gold-500/20 text-prestige-white rounded-md px-3 py-2 focus:border-prestige-gold-500 focus:outline-none focus:ring-1 focus:ring-prestige-gold-500"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="ai">AI Automations Kurs</option>
                        <option value="dropshipping">EU Dropshipping Kurs</option>
                        <option value="both">Beide Kurse</option>
                        <option value="unsure">Noch unsicher</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-prestige-gray-300">
                        Ihre Nachricht (optional)
                      </Label>
                      <Textarea 
                        id="message" 
                        rows={4}
                        className="bg-prestige-black border-prestige-gold-500/20 text-prestige-white focus:border-prestige-gold-500"
                        placeholder="Erzählen Sie uns kurz über Ihre Ziele und Erwartungen..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referral" className="text-prestige-gray-300">
                        Wie haben Sie von uns erfahren?
                      </Label>
                      <select 
                        id="referral"
                        className="w-full bg-prestige-black border border-prestige-gold-500/20 text-prestige-white rounded-md px-3 py-2 focus:border-prestige-gold-500 focus:outline-none focus:ring-1 focus:ring-prestige-gold-500"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="google">Google</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                        <option value="creator">Creator / Influencer</option>
                        <option value="friend">Freunde / Bekannte</option>
                        <option value="other">Sonstiges</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full btn-gold text-lg py-6">
                      Erstgespräch anfragen
                    </Button>

                    <p className="text-xs text-prestige-gray-500 text-center">
                      Mit dem Absenden stimmen Sie unserer{' '}
                      <a href="/legal/datenschutz" className="text-prestige-gold-500 hover:underline">
                        Datenschutzerklärung
                      </a>{' '}
                      zu.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* What to Expect */}
              <Card className="card-prestige">
                <CardHeader>
                  <CardTitle className="text-prestige-white flex items-center">
                    <MessageSquare className="h-6 w-6 text-prestige-gold-500 mr-3" />
                    Was Sie erwartet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Persönliches 30-45 Minuten Gespräch',
                    'Analyse Ihrer aktuellen Situation',
                    'Klärung Ihrer Ziele und Erwartungen',
                    'Empfehlung des passenden Kurses',
                    'Beantwortung all Ihrer Fragen',
                    'Keine Verkaufsdruck, nur ehrliche Beratung'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-prestige-gold-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-prestige-gray-300">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="card-prestige">
                <CardHeader>
                  <CardTitle className="text-prestige-white">
                    Kontaktinformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-prestige-gold-500 mt-1" />
                    <div>
                      <p className="text-prestige-gray-400 text-sm">E-Mail</p>
                      <a 
                        href="mailto:info@universityecom.de" 
                        className="text-prestige-white hover:text-prestige-gold-500"
                      >
                        info@universityecom.de
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-prestige-gold-500 mt-1" />
                    <div>
                      <p className="text-prestige-gray-400 text-sm">Telefon</p>
                      <a 
                        href="tel:+4917012345678" 
                        className="text-prestige-white hover:text-prestige-gold-500"
                      >
                        +49 170 123 456 78
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-prestige-gold-500 mt-1" />
                    <div>
                      <p className="text-prestige-gray-400 text-sm">Erreichbarkeit</p>
                      <p className="text-prestige-white">Mo - Fr: 9:00 - 18:00 Uhr</p>
                      <p className="text-prestige-gray-400 text-sm">Sa - So: Nach Vereinbarung</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badge */}
              <Card className="card-prestige border-prestige-gold-500/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Crown className="w-12 h-12 text-prestige-gold-500 mx-auto mb-4" />
                    <h3 className="text-prestige-white font-semibold mb-2">
                      100% Kostenlos & Unverbindlich
                    </h3>
                    <p className="text-prestige-gray-400 text-sm">
                      Das Erstgespräch ist völlig kostenlos und Sie gehen keinerlei Verpflichtungen ein. 
                      Wir beraten Sie ehrlich und individuell.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 py-20 section-prestige">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-4">
              So geht es weiter
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Anfrage senden',
                desc: 'Füllen Sie das Formular aus und senden Sie Ihre Anfrage ab.'
              },
              {
                step: '2',
                title: 'Termin vereinbaren',
                desc: 'Wir melden uns innerhalb von 24 Stunden mit Terminvorschlägen.'
              },
              {
                step: '3',
                title: 'Erstgespräch',
                desc: 'Im persönlichen Gespräch klären wir alle Ihre Fragen.'
              },
              {
                step: '4',
                title: 'Entscheidung',
                desc: 'Sie entscheiden in Ruhe, ob und welcher Kurs zu Ihnen passt.'
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-prestige-gold-500/10 border-2 border-prestige-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-prestige-gold-500 font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-prestige-white font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-prestige-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
