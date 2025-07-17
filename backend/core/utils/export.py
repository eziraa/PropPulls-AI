import os
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def export_deals_to_excel(deals: list, excel_path: str = "deals.xlsx"):
    flat_data = []
    for deal in deals:
        result = deal.get("analysis_result", {})
        recommendations = result.get("recommendations", [])
        recommendations_text = "\n• " + "\n• ".join(recommendations) if recommendations else ""

        flat_data.append({
            "Deal ID": deal["id"],
            "Address": deal["address"],
            "City": deal["city"],
            "State": deal["state"],
            "Zip Code": deal["zip_code"],
            "Property Type": deal["property_type"],
            "Asking Price": deal["asking_price"],
            "Rent": deal["fetched_data"]["rent"],
            "Sqft": deal["fetched_data"]["sqft"],
            "Bedrooms": deal["fetched_data"]["bedrooms"],
            "Bathrooms": deal["fetched_data"]["bathrooms"],
            "Cap Rate (Fetched)": deal["fetched_data"]["cap_rate"],
            "Cap Rate (Analysis)": result.get("cap_rate"),
            "Cash on Cash": result.get("cash_on_cash"),
            "Risk Score": result.get("risk_score"),
            "Pass Status": result.get("pass_status"),
            "Recommendations": recommendations_text.strip(),
        })

    df = pd.DataFrame(flat_data)
    df.to_excel(excel_path, index=False)
    print(f"✅ Excel exported to: {excel_path}")

def export_deals_to_pdf(deals: list, pdf_path: str):
    flat_data = []
    for deal in deals:
        result = deal.get("analysis_result", {})
        recommendations = result.get("recommendations", []) if result else []
        recommendations_text = "\n• " + "\n• ".join(recommendations) if recommendations else ""

        flat_data.append({
            "Deal ID": deal["id"],
            "Address": deal["address"],
            "City": deal["city"],
            "State": deal["state"],
            "Zip Code": deal["zip_code"],
            "Property Type": deal["property_type"],
            "Asking Price": deal["asking_price"],
            "Rent": deal["fetched_data"].get("rent", ""),
            "Sqft": deal["fetched_data"].get("sqft", ""),
            "Bedrooms": deal["fetched_data"].get("bedrooms", ""),
            "Bathrooms": deal["fetched_data"].get("bathrooms", ""),
            "Cap Rate (Fetched)": deal["fetched_data"].get("cap_rate", ""),
            "Cap Rate (Analysis)": result.get("cap_rate", ""),
            "Cash on Cash": result.get("cash_on_cash", ""),
            "Risk Score": result.get("risk_score", ""),
            "Pass Status": result.get("pass_status", ""),
            "Recommendations": recommendations_text.strip(),
        })

    # Ensure the directory exists
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

    pdf = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=10, leftMargin=10, topMargin=10, bottomMargin=10)
    elements = []

    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]

    # Custom style for recommendations to wrap text nicely
    recommendation_style = ParagraphStyle(
        "recommendation",
        fontSize=8,
        leading=10,
        wordWrap='CJK',  # wraps long lines
    )

    elements.append(Paragraph("Deal Analysis Report", styles["Title"]))
    elements.append(Spacer(1, 12))

    headers = list(flat_data[0].keys())
    table_data = [headers]

    for row in flat_data:
        table_row = []
        for h in headers:
            cell_value = row[h]
            if h == "Recommendations":
                # Wrap recommendations text in a Paragraph
                cell_value = Paragraph(str(cell_value), recommendation_style)
            else:
                cell_value = str(cell_value)
            table_row.append(cell_value)
        table_data.append(table_row)

    # Calculate column width to fit the page width
    page_width = letter[0] - pdf.leftMargin - pdf.rightMargin
    col_width = page_width / len(headers)

    table = Table(table_data, repeatRows=1, colWidths=[col_width] * len(headers))
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#047857")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
    ]))

    elements.append(table)
    pdf.build(elements)

    print(f"✅ PDF exported to: {pdf_path}")
    