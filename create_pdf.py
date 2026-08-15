import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable
from reportlab.lib import colors

pdf_path = os.path.join('examples', 'Quantum_Neural_Architectures_Sample_Paper.pdf')
doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle', parent=styles['Normal'],
    fontName='Helvetica-Bold', fontSize=16, leading=20,
    textColor=colors.HexColor('#210a30'), spaceAfter=8
)

subtitle_style = ParagraphStyle(
    'DocSubtitle', parent=styles['Normal'],
    fontName='Helvetica-Oblique', fontSize=10, leading=14,
    textColor=colors.HexColor('#5a5660'), spaceAfter=14
)

heading_style = ParagraphStyle(
    'DocHeading', parent=styles['Normal'],
    fontName='Helvetica-Bold', fontSize=12, leading=16,
    textColor=colors.HexColor('#3b1c4e'), spaceBefore=12, spaceAfter=6
)

body_style = ParagraphStyle(
    'DocBody', parent=styles['Normal'],
    fontName='Times-Roman', fontSize=10.5, leading=15,
    textColor=colors.HexColor('#1a181c'), spaceAfter=10
)

claim_style = ParagraphStyle(
    'DocClaim', parent=styles['Normal'],
    fontName='Times-Italic', fontSize=10, leading=14,
    textColor=colors.HexColor('#2e1065'), leftIndent=15, spaceAfter=8
)

story = []

story.append(Paragraph('Quantum-Classical Hybrid Architectures for Adversarial Citation Integrity Verification', title_style))
story.append(Paragraph('<b>Dr. Elena Vance, Prof. Marcus Sterling, Dr. Rajesh Kumar</b><br/><i>Institute for Advanced Scientific Integrity &amp; AI Architecture</i>', subtitle_style))
story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#e4decb'), spaceAfter=14))

story.append(Paragraph('Abstract', heading_style))
story.append(Paragraph('We introduce a novel hybrid architecture for automated manuscript evaluation and citation integrity verification. By combining dual-agent adversarial consensus protocols with multi-source retrieval across arXiv and PubMed Central, our engine isolates claim overreach and unstated methodological caveats. Experimental evaluation across 1,200 peer-reviewed manuscripts demonstrates 94.6% agreement with human expert benchmarks while reducing manual audit latency by 85%. Furthermore, we present the Two Pens stroke resolution algorithm for visual passage comparison.', body_style))

story.append(Paragraph('1. Primary Manuscript Claims', heading_style))
story.append(Paragraph('Our empirical findings establish four core principles governing automated citation verification:', body_style))

story.append(Paragraph('<b>[1] Claim 1 (Multimodal Transfer):</b> Pre-trained visual-language representations achieve 76.2% zero-shot top-1 accuracy across diverse computer vision benchmarks [1].', claim_style))
story.append(Paragraph('<b>[2] Claim 2 (Adversarial Red-Teaming):</b> Dual-agent adversarial red-teaming isolates subtle claim overreach and unstated methodological caveats in scientific literature [2].', claim_style))
story.append(Paragraph('<b>[3] Claim 3 (Attention Complexity):</b> Quantum-assisted tensor decomposition reduces self-attention layer computational complexity from quadratic O(N2) to logarithmic O(N log N) [3].', claim_style))
story.append(Paragraph('<b>[4] Claim 4 (Cost Auditability):</b> Itemized token cost accounting provides transparent real-time auditability across heterogeneous LLM pipeline executions [4].', claim_style))

story.append(Paragraph('2. Cited References &amp; Literature', heading_style))
story.append(Paragraph('[1] Radford et al., "Learning Transferable Visual Models From Natural Language Supervision", ICML 2021.', body_style))
story.append(Paragraph('[2] Vaswani et al., "Attention Is All You Need", NeurIPS 2017.', body_style))
story.append(Paragraph('[3] Brown et al., "Language Models are Few-Shot Learners", NeurIPS 2020.', body_style))
story.append(Paragraph('[4] Kaplan et al., "Scaling Laws for Neural Language Models", arXiv 2020.', body_style))

doc.build(story)
shutil.copy(pdf_path, 'Quantum_Neural_Architectures_Sample_Paper.pdf')
print('PDF created successfully at:', os.path.abspath(pdf_path))
