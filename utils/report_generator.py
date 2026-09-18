import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import sqlite3
import os
import io
import base64

class ComprehensiveReportGenerator:
    def __init__(self, db_path="../data/supply_chain.db", output_dir="../reports"):
        self.db_path = db_path
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
    def generate_risk_charts(self):
        """Generate risk analysis charts"""
        conn = sqlite3.connect(self.db_path)
        
        # Get supplier data
        suppliers = pd.read_sql_query('''
            SELECT name, country, risk_score, reliability_score, revenue
            FROM suppliers
            WHERE risk_score IS NOT NULL
        ''', conn)
        
        # Risk distribution by country
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 2, 1)
        country_risk = suppliers.groupby('country')['risk_score'].mean().sort_values(ascending=False)
        country_risk.head(10).plot(kind='bar')
        plt.title('Average Risk Score by Country')
        plt.xticks(rotation=45)
        plt.ylabel('Risk Score')
        
        plt.subplot(2, 2, 2)
        plt.hist(suppliers['risk_score'], bins=20, alpha=0.7, color='red')
        plt.title('Risk Score Distribution')
        plt.xlabel('Risk Score')
        plt.ylabel('Frequency')
        
        plt.subplot(2, 2, 3)
        plt.scatter(suppliers['reliability_score'], suppliers['risk_score'], alpha=0.6)
        plt.xlabel('Reliability Score')
        plt.ylabel('Risk Score')
        plt.title('Risk vs Reliability')
        
        plt.subplot(2, 2, 4)
        high_risk = suppliers[suppliers['risk_score'] > 0.7]
        if not high_risk.empty:
            high_risk.nlargest(10, 'risk_score')[['name', 'risk_score']].set_index('name').plot(kind='barh')
            plt.title('Top 10 High Risk Suppliers')
            plt.xlabel('Risk Score')
        
        plt.tight_layout()
        chart_path = os.path.join(self.output_dir, 'risk_analysis_charts.png')
        plt.savefig(chart_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        conn.close()
        return chart_path
    
    def generate_network_analysis(self):
        """Generate network analysis summary"""
        conn = sqlite3.connect(self.db_path)
        
        # Network statistics
        suppliers_count = pd.read_sql_query("SELECT COUNT(*) as count FROM suppliers", conn).iloc[0]['count']
        components_count = pd.read_sql_query("SELECT COUNT(*) as count FROM components", conn).iloc[0]['count']
        links_count = pd.read_sql_query("SELECT COUNT(*) as count FROM supply_links", conn).iloc[0]['count']
        
        # Tier distribution
        tier_dist = pd.read_sql_query('''
            SELECT tier_level, COUNT(*) as count
            FROM supply_links
            GROUP BY tier_level
            ORDER BY tier_level
        ''', conn)
        
        conn.close()
        
        return {
            'suppliers_count': suppliers_count,
            'components_count': components_count,
            'links_count': links_count,
            'tier_distribution': tier_dist.to_dict('records')
        }
    
    def generate_recommendations_summary(self):
        """Generate alternative supplier recommendations summary"""
        conn = sqlite3.connect(self.db_path)
        
        # Get high-risk suppliers and potential alternatives
        high_risk_suppliers = pd.read_sql_query('''
            SELECT s.name, s.country, s.risk_score, c.name as component
            FROM suppliers s
            JOIN supply_links sl ON s.supplier_id = sl.supplier_id
            JOIN components c ON sl.component_id = c.component_id
            WHERE s.risk_score > 0.7
            ORDER BY s.risk_score DESC
            LIMIT 10
        ''', conn)
        
        # Get low-risk alternatives
        alternatives = pd.read_sql_query('''
            SELECT name, country, risk_score, reliability_score
            FROM suppliers
            WHERE risk_score < 0.4
            ORDER BY reliability_score DESC, risk_score ASC
            LIMIT 15
        ''', conn)
        
        conn.close()
        
        return {
            'high_risk': high_risk_suppliers.to_dict('records'),
            'alternatives': alternatives.to_dict('records')
        }
    
    def generate_pdf_report(self):
        """Generate comprehensive PDF report"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"supply_chain_comprehensive_report_{timestamp}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        # Create PDF document
        doc = SimpleDocTemplate(filepath, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("LinkGuard Supply Chain Risk Analysis Report", title_style))
        story.append(Spacer(1, 20))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", styles['Heading2']))
        
        # Get network analysis
        network_stats = self.generate_network_analysis()
        
        summary_text = f"""
        This comprehensive report analyzes the supply chain network consisting of {network_stats['suppliers_count']} suppliers, 
        {network_stats['components_count']} components, and {network_stats['links_count']} supply relationships. 
        The analysis identifies high-risk suppliers and provides recommendations for alternative sourcing strategies.
        
        Report generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        story.append(Paragraph(summary_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Network Statistics
        story.append(Paragraph("Network Statistics", styles['Heading2']))
        
        network_data = [
            ['Metric', 'Value'],
            ['Total Suppliers', str(network_stats['suppliers_count'])],
            ['Total Components', str(network_stats['components_count'])],
            ['Supply Relationships', str(network_stats['links_count'])]
        ]
        
        # Add tier distribution
        for tier in network_stats['tier_distribution']:
            network_data.append([f"Tier {tier['tier_level']} Links", str(tier['count'])])
        
        network_table = Table(network_data)
        network_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(network_table)
        story.append(Spacer(1, 20))
        
        # High Risk Suppliers
        story.append(Paragraph("High Risk Suppliers Analysis", styles['Heading2']))
        
        recommendations = self.generate_recommendations_summary()
        
        if recommendations['high_risk']:
            risk_data = [['Supplier Name', 'Country', 'Risk Score', 'Component']]
            for supplier in recommendations['high_risk'][:10]:
                risk_data.append([
                    supplier['name'],
                    supplier['country'],
                    f"{supplier['risk_score']:.2f}",
                    supplier['component']
                ])
            
            risk_table = Table(risk_data)
            risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.red),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(risk_table)
        else:
            story.append(Paragraph("No high-risk suppliers identified.", styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Alternative Suppliers Recommendations
        story.append(Paragraph("Recommended Alternative Suppliers", styles['Heading2']))
        
        if recommendations['alternatives']:
            alt_data = [['Supplier Name', 'Country', 'Risk Score', 'Reliability Score']]
            for alt in recommendations['alternatives'][:10]:
                alt_data.append([
                    alt['name'],
                    alt['country'],
                    f"{alt['risk_score']:.2f}",
                    f"{alt['reliability_score']:.2f}"
                ])
            
            alt_table = Table(alt_data)
            alt_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.green),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(alt_table)
        
        story.append(Spacer(1, 20))
        
        # Add charts if available
        try:
            chart_path = self.generate_risk_charts()
            if os.path.exists(chart_path):
                story.append(Paragraph("Risk Analysis Charts", styles['Heading2']))
                story.append(Image(chart_path, width=6*inch, height=4.5*inch))
        except Exception as e:
            print(f"Could not generate charts: {e}")
        
        # Recommendations and Conclusions
        story.append(Spacer(1, 20))
        story.append(Paragraph("Key Recommendations", styles['Heading2']))
        
        recommendations_text = """
        1. Immediate Action Required: Review contracts with suppliers showing risk scores above 0.7
        2. Diversification Strategy: Consider geographic diversification to reduce concentration risk
        3. Alternative Sourcing: Evaluate recommended alternative suppliers for critical components
        4. Continuous Monitoring: Implement regular risk assessment updates
        5. Contingency Planning: Develop backup supplier relationships for high-risk components
        """
        story.append(Paragraph(recommendations_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        return filepath
    
    def generate_csv_export(self):
        """Generate CSV exports of key data"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        conn = sqlite3.connect(self.db_path)
        
        # Export high-risk suppliers
        high_risk = pd.read_sql_query('''
            SELECT s.*, sl.tier_level, c.name as component_name
            FROM suppliers s
            LEFT JOIN supply_links sl ON s.supplier_id = sl.supplier_id
            LEFT JOIN components c ON sl.component_id = c.component_id
            WHERE s.risk_score > 0.6
            ORDER BY s.risk_score DESC
        ''', conn)
        
        csv_path = os.path.join(self.output_dir, f"high_risk_suppliers_{timestamp}.csv")
        high_risk.to_csv(csv_path, index=False)
        
        conn.close()
        return csv_path

def main():
    """Generate all reports"""
    generator = ComprehensiveReportGenerator()
    
    print("Generating comprehensive supply chain report...")
    
    # Generate PDF report
    pdf_path = generator.generate_pdf_report()
    print(f"PDF report generated: {pdf_path}")
    
    # Generate CSV export
    csv_path = generator.generate_csv_export()
    print(f"CSV export generated: {csv_path}")
    
    return pdf_path, csv_path

if __name__ == "__main__":
    main()