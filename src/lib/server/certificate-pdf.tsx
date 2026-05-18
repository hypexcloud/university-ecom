import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 60, fontFamily: 'Helvetica', backgroundColor: '#fafafa' },
  border: { border: '3px solid #D4AF37', padding: 40, minHeight: '100%' },
  header: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#D4AF37', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
  body: { textAlign: 'center', marginBottom: 40 },
  certText: { fontSize: 12, color: '#444', marginBottom: 8 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#111', marginTop: 20, marginBottom: 20 },
  course: { fontSize: 18, color: '#333', marginBottom: 8 },
  date: { fontSize: 11, color: '#888', marginTop: 30 },
  footer: { position: 'absolute', bottom: 60, left: 60, right: 60, textAlign: 'center', fontSize: 9, color: '#aaa' },
})

interface CertificateData {
  customerName: string
  productTitle: string
  issuedDate: string
  certificateId: string
}

function CertificateDocument({ data }: { data: CertificateData }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Text style={styles.title}>ZERTIFIKAT</Text>
            <Text style={styles.subtitle}>University Ecom</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.certText}>Hiermit wird bestätigt, dass</Text>
            <Text style={styles.name}>{data.customerName}</Text>
            <Text style={styles.certText}>den folgenden Kurs erfolgreich abgeschlossen hat:</Text>
            <Text style={styles.course}>{data.productTitle}</Text>
            <Text style={styles.date}>Ausgestellt am {data.issuedDate}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Zertifikat-ID: {data.certificateId} · University Ecom · university-ecom.com
        </Text>
      </Page>
    </Document>
  )
}

export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  return renderToBuffer(<CertificateDocument data={data} />)
}
