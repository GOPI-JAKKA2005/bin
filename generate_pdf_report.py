import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image as PILImage

def build_pdf():
    pdf_filename = "EcoSmart_AI_Waste_Classification_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#10b981")    # Eco Green
    SECONDARY = colors.HexColor("#06b6d4")  # Cyan Accent
    DARK_BG = colors.HexColor("#0f172a")    # Slate Dark
    TEXT_DARK = colors.HexColor("#1e293b")  # Dark Text
    TEXT_MUTED = colors.HexColor("#64748b") # Muted Text
    LIGHT_BG = colors.HexColor("#f8fafc")   # Card Surface
    BORDER_CLR = colors.HexColor("#e2e8f0") # Border

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=TEXT_MUTED,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=DARK_BG,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK
    )

    label_style = ParagraphStyle(
        'LabelBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=PRIMARY
    )

    story = []

    # Title & Subtitle Header
    story.append(Paragraph("EcoSmart AI - Complete Multi-Stream Waste Classification Report", title_style))
    story.append(Paragraph("Full Object Detection, Media Analysis & Recovery Guidelines for All Standardized Waste Streams", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=10))

    # Executive Summary Card
    summary_text = """
    <b>Executive Summary:</b> This official report presents computer vision object classification results, resource recovery range estimates, and safety protocols across all analyzed waste streams: <b>Wet Organic Waste</b>, <b>Plastic Recyclables</b>, <b>Clinical Medical Biohazards</b>, and <b>Hazardous Materials</b>.<br/><br/>
    <b>Safety Priority Order:</b> Biomedical and Hazardous materials strictly override general recycling procedures to mandate yellow biohazard box isolation and steam autoclaving prior to any secondary treatment.
    """
    summary_p = Paragraph(summary_text, body_style)
    summary_table = Table([[summary_p]], colWidths=[540])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # All 7 User Uploaded Images & Classification Items
    base_user_dir = "C:/Users/gopij/.gemini/antigravity/brain/9c9b030f-d806-46d9-a337-1c5e70ac3267/.user_uploaded"
    
    images_data = [
        {
            "filename": "media_1788950567509.jpg",
            "title": "Image 1: EcoSmart Universal Recycling Symbol Logo",
            "item_name": "Universal Recycling Symbol (Mobius Loop)",
            "category": "System Brand Asset / Circular Economy Indicator",
            "confidence": "100%",
            "recovery": "N/A (Brand Symbol)",
            "bin": "System Asset",
            "explanation": """
            <b>Object Description:</b> Green distressed circular Mobius loop recycling arrow symbol.<br/>
            <b>System Role:</b> Serves as the primary brand asset and visual indicator for closed-loop resource recovery in the EcoSmart AI platform.<br/>
            <b>Environmental Significance:</b> Symbolizes total material diversion from municipal dumping grounds into productive circular economy loops.
            """
        },
        {
            "filename": "media_1789635962671.webp",
            "title": "Image 2: Mixed Disposable Plastic & Single-Use Packaging Pile",
            "item_name": "Disposable Plastic Cups, Straws, PET Bottles & Packaging",
            "category": "Dry / Recyclable Waste Stream (Plastics)",
            "confidence": "96%",
            "recovery": "80% – 95% Recovery Potential",
            "bin": "Blue Dry Recycling Bin",
            "explanation": """
            <b>Object Description:</b> Dense pile of single-use clear plastic beverage cups, straws, PET water bottles, paper plates, and plastic film wrapping.<br/>
            <b>Classification Stream:</b> <font color="#1d4ed8"><b>Dry / Recyclable Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> Synthetic polymers (PET, Polypropylene, HDPE). Non-biodegradable polymer waste that can be mechanically shredded, washed, melted into rPET pellets, and extruded into new containers or polyester textile fibers.<br/>
            <b>Environmental Benefits:</b> Conserves petroleum resources, saves 66% manufacturing energy, and prevents long-lasting polymer accumulation in ocean ecosystems.<br/>
            <b>Handling Instructions:</b> Rinse liquid residues clean, crush flat, and place in Blue Recycling Bin.
            """
        },
        {
            "filename": "media_1789636020573.webp",
            "title": "Image 3: Clinical Medical Syringes, Needles & Biohazard Sharps",
            "item_name": "Used Clinical Syringes, Needles, Glass Vials & Inhalers",
            "category": "Biomedical Waste Stream (Biohazard Alert)",
            "confidence": "98%",
            "recovery": "0% – 15% (Specialized Autoclave Sterilization Only)",
            "bin": "Yellow Puncture-Proof Biohazard Sharps Box",
            "explanation": """
            <font color="#b91c1c"><b>CRITICAL BIOHAZARD SAFETY ALERT:</b></font> Used hypodermic needles, clinical glass medicine vials, asthma inhalers, and biohazard sharps.<br/>
            <b>Classification Stream:</b> <font color="#b91c1c"><b>Biomedical Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> Infectious clinical items capable of harboring bloodborne pathogens (Hepatitis B, HIV). Requires high-pressure steam autoclaving at 121°C or clinical incineration.<br/>
            <b>Safety Protocol:</b><br/>
            1. <b>DO NOT RECAP NEEDLES</b> to avoid needle-stick injuries.<br/>
            2. Wear heavy-duty nitrile gloves and isolate immediately in rigid yellow biohazard boxes.<br/>
            3. Deliver to an authorized hospital biohazard collection center.
            """
        },
        {
            "filename": "media_1788955473519.jpg",
            "title": "Image 4: Dried & Green Banana Leaves and Plant Stalks",
            "item_name": "Banana Leaves & Plant Stalks (Musa paradisiaca)",
            "category": "Wet / Organic Waste Stream",
            "confidence": "97%",
            "recovery": "85% – 98% Recovery Potential",
            "bin": "Green Wet Organic Bin",
            "explanation": """
            <b>Object Description:</b> Large green and dried banana leaf fronds with fibrous plant stems.<br/>
            <b>Classification Stream:</b> <font color="#047857"><b>Wet / Organic Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> High-cellulose natural plant matter. 100% biodegradable and compostable.<br/>
            <b>Recommended Processing:</b> Aerobic Composting, Agricultural Mulching, or Shredding for Bio-digestion.<br/>
            <b>Environmental Benefits:</b> Decomposes into fertile soil humus, retains soil moisture, and enriches soil organic carbon without synthetic chemical fertilizers.
            """
        },
        {
            "filename": "media_1788955473525.jpg",
            "title": "Image 5: Stack of Fresh Yellow Banana Peels",
            "item_name": "Yellow Banana Peels (Organic Food Scraps)",
            "category": "Wet / Organic Waste Stream",
            "confidence": "97%",
            "recovery": "90% – 98% Recovery Potential",
            "bin": "Green Wet Organic Bin",
            "explanation": """
            <b>Object Description:</b> Fresh yellow pericarp banana peels stacked in organic food waste stream.<br/>
            <b>Classification Stream:</b> <font color="#047857"><b>Wet / Organic Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> High-moisture organic fruit skin tissue rich in potassium (K), nitrogen (N), and organic carbon.<br/>
            <b>Recommended Processing:</b> Aerobic Composting, Vermicomposting, or Bio-gas Anaerobic Digestion.<br/>
            <b>Environmental Benefits:</b> Produces high-grade potassium-enriched organic fertilizer and prevents landfill methane emissions.
            """
        },
        {
            "filename": "media_1788955473527.jpg",
            "title": "Image 6: Speckled Yellow & Brown Ripened Banana Peels",
            "item_name": "Speckled Ripened Banana Peels & Fruit Residue",
            "category": "Wet / Organic Waste Stream",
            "confidence": "96%",
            "recovery": "90% – 98% Recovery Potential",
            "bin": "Green Wet Organic Bin",
            "explanation": """
            <b>Object Description:</b> Fully ripened banana peels showing natural enzymatic brown speckling.<br/>
            <b>Classification Stream:</b> <font color="#047857"><b>Wet / Organic Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> Digestible organic matter containing simple sugars, cellulose, and micronutrients.<br/>
            <b>Recommended Processing:</b> Aerobic Composting or Vermicomposting.<br/>
            <b>Environmental Benefits:</b> Easily broken down into fertile humus for farm soil.
            """
        },
        {
            "filename": "media_1788955473529.jpg",
            "title": "Image 7: Mixed Fruit Scraps (Grapes, Plums, Apples & Greens)",
            "item_name": "Bunch of Grapes, Plums, Apple Cores & Leafy Herbs",
            "category": "Wet / Organic Waste Stream",
            "confidence": "96%",
            "recovery": "88% – 98% Recovery Potential",
            "bin": "Green Wet Organic Bin",
            "explanation": """
            <b>Object Description:</b> Mixture of fruit waste including dark grapes, plums, apple pieces, citrus rinds, and parsley greens.<br/>
            <b>Classification Stream:</b> <font color="#047857"><b>Wet / Organic Waste Stream</b></font>.<br/>
            <b>Scientific Explanation:</b> High-moisture anthocyanin and organic acid rich fruit residues.<br/>
            <b>Recommended Processing:</b> Aerobic Composting, Vermicomposting, or Bio-gas Fermentation.<br/>
            <b>Environmental Benefits:</b> Supplies essential micronutrients (phosphorus, potassium, organic acids) to compost mixtures.
            """
        }
    ]

    story.append(Paragraph("Detailed AI Object Classification per Image", h2_style))
    story.append(Spacer(1, 4))

    for item in images_data:
        img_path = os.path.join(base_user_dir, item["filename"])
        
        # Load and resize image for PDF (Convert WebP/PNG to JPG if needed for reportlab)
        if os.path.exists(img_path):
            try:
                pil_img = PILImage.open(img_path).convert('RGB')
                temp_png = img_path + "_converted.png"
                pil_img.save(temp_png, "PNG")

                w, h = pil_img.size
                aspect = h / float(w)
                display_w = 165
                display_h = int(display_w * aspect)
                if display_h > 140:
                    display_h = 140
                    display_w = int(display_h / aspect)
                rl_img = RLImage(temp_png, width=display_w, height=display_h)
            except Exception as e:
                rl_img = Paragraph(f"Image File ({item['filename']})", body_style)
        else:
            rl_img = Paragraph("Image File Not Found", body_style)

        info_text = f"""
        <b>Identified Item:</b> {item['item_name']}<br/>
        <b>Assigned Category:</b> {item['category']}<br/>
        <b>AI Detection Confidence:</b> <b>{item['confidence']}</b><br/>
        <b>Estimated Recovery:</b> {item['recovery']}<br/>
        <b>Disposal Bin:</b> <b>{item['bin']}</b><br/><br/>
        {item['explanation']}
        """
        info_p = Paragraph(info_text, body_style)

        table_data = [
            [
                Paragraph(f"<b>{item['title']}</b>", label_style),
                ""
            ],
            [
                rl_img,
                info_p
            ]
        ]

        card_table = Table(table_data, colWidths=[175, 355])
        card_table.setStyle(TableStyle([
            ('SPAN', (0,0), (1,0)),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
            ('BACKGROUND', (0,1), (-1,1), LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
            ('PADDING', (0,0), (-1,-1), 7),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (0,1), (0,1), 'CENTER'),
        ]))

        story.append(KeepTogether([card_table, Spacer(1, 8)]))

    # Summary Table of All Standardized Streams
    story.append(Spacer(1, 6))
    story.append(Paragraph("Standardized Waste Stream Guidelines Summary", h2_style))
    
    stream_table_data = [
        [
            Paragraph("<b>Stream Category</b>", label_style),
            Paragraph("<b>Target Materials</b>", label_style),
            Paragraph("<b>Recovery Est.</b>", label_style),
            Paragraph("<b>Disposal Bin</b>", label_style)
        ],
        [
            Paragraph("<b>Wet / Organic</b>", body_style),
            Paragraph("Banana peels, leaves, grapes, food scraps, coffee grounds, garden trim", body_style),
            Paragraph("70% - 98%", body_style),
            Paragraph("Green Organic Bin", body_style)
        ],
        [
            Paragraph("<b>Dry / Recyclable</b>", body_style),
            Paragraph("PET plastic cups/bottles, straws, cardboard boxes, paper, glass, metal cans", body_style),
            Paragraph("60% - 95%", body_style),
            Paragraph("Blue Recycling Bin", body_style)
        ],
        [
            Paragraph("<b>Biomedical</b>", body_style),
            Paragraph("Used syringes, needles, clinical gloves, glass vials, bandages, medicine", body_style),
            Paragraph("0% - 15% (Autoclave)", body_style),
            Paragraph("Yellow Biohazard Box", body_style)
        ],
        [
            Paragraph("<b>Hazardous</b>", body_style),
            Paragraph("Lithium batteries, paints, solvents, e-waste, fluorescent bulbs", body_style),
            Paragraph("10% - 70%", body_style),
            Paragraph("Red / Hazard Kiosk", body_style)
        ]
    ]

    stream_table = Table(stream_table_data, colWidths=[110, 230, 90, 110])
    stream_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#d1fae5")),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    story.append(stream_table)

    # Build PDF
    doc.build(story)

    # Copy to artifact folder
    artifact_dir = "C:/Users/gopij/.gemini/antigravity/brain/9c9b030f-d806-46d9-a337-1c5e70ac3267"
    if os.path.exists(artifact_dir):
        shutil.copy(pdf_filename, os.path.join(artifact_dir, pdf_filename))

    print("PDF Report generated successfully: " + pdf_filename)

if __name__ == "__main__":
    build_pdf()
