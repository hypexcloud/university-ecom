import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#D4AF37' },
  subtitle: { fontSize: 8, color: '#666', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  line: { borderBottom: '1px solid #eee', marginVertical: 8 },
  bold: { fontWeight: 'bold' },
  right: { textAlign: 'right' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, fontSize: 8, color: '#888', textAlign: 'center' },
})

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  // Seller
  sellerName: string
  sellerAddress: string
  sellerTaxId: string
  // Buyer
  buyerName: string
  buyerAddress: string
  buyerTaxId?: string
  // Items
  items: { description: string; netCents: number }[]
  // Totals
  netTotalCents: number
  vatRate: number // e.g. 19
  vatCents: number
  grossTotalCents: number
  // Payment
  paymentMethod: string
  paymentRef: string
}

function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>RECHNUNG</Text>
            <Text style={styles.subtitle}>{data.invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.bold}>{data.sellerName}</Text>
            <Text>{data.sellerAddress}</Text>
            <Text>USt-IdNr.: {data.sellerTaxId}</Text>
          </View>
        </View>

        {/* Buyer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechnungsempfänger</Text>
          <Text>{data.buyerName}</Text>
          <Text>{data.buyerAddress}</Text>
          {data.buyerTaxId && <Text>USt-IdNr.: {data.buyerTaxId}</Text>}
        </View>

        {/* Invoice details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Rechnungsdatum:</Text>
            <Text>{data.invoiceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text>Rechnungsnummer:</Text>
            <Text>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text>Zahlungsart:</Text>
            <Text>{data.paymentMethod}</Text>
          </View>
        </View>

        {/* Line items */}
        <View style={styles.section}>
          <View style={[styles.row, { borderBottom: '1px solid #000', paddingBottom: 4 }]}>
            <Text style={styles.bold}>Beschreibung</Text>
            <Text style={[styles.bold, styles.right]}>Netto</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text>{item.description}</Text>
              <Text style={styles.right}>{formatEuro(item.netCents)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.line} />
        <View style={styles.row}>
          <Text>Nettobetrag:</Text>
          <Text style={styles.right}>{formatEuro(data.netTotalCents)}</Text>
        </View>
        <View style={styles.row}>
          <Text>USt. {data.vatRate}%:</Text>
          <Text style={styles.right}>{formatEuro(data.vatCents)}</Text>
        </View>
        <View style={[styles.row, { marginTop: 4 }]}>
          <Text style={styles.bold}>Gesamtbetrag (brutto):</Text>
          <Text style={[styles.bold, styles.right]}>{formatEuro(data.grossTotalCents)}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {data.sellerName} · {data.sellerAddress} · USt-IdNr. {data.sellerTaxId} · Ref: {data.paymentRef}
        </Text>
      </Page>
    </Document>
  )
}
