import os
import re
import numpy as np
import google.generativeai as genai
import json

# Setup Gemini
genai.configure(api_key="")
model = genai.GenerativeModel("gemini-1.5-pro")


def calculate_cap_rate(noi, purchase_price):
    return round(noi / purchase_price, 4) if purchase_price else None


def calculate_cash_on_cash(annual_cash_flow, cash_invested):
    return round(annual_cash_flow / cash_invested, 4) if cash_invested else None


def calculate_irr(cash_flows):
    try:
        return round(float(np.irr(cash_flows)), 4)
    except Exception:
        return None


import json

def perform_risk_analysis(area_income, crime_score, t12_data, rent_roll_data):
    prompt = f"""
    You are a real estate AI analyst.

    Analyze risk based on:
    - Area median income: ${area_income}
    - Crime score: {crime_score}/10
    - T12 financial data (12 months of income & expenses)
    - Rent roll data (unit-level details: rent, occupancy, size)

    T12 Data:
    {json.dumps(t12_data, indent=2)}

    Rent Roll Data:
    {json.dumps(rent_roll_data, indent=2)}

    Return a JSON with:
    - risk_score: (Low, Medium, High)
    - explanation: (concise reasoning)
    - red_flags: list of major concerns from crime, financials, or rent roll
    """

    response = model.generate_content(prompt)

    try:
        content = clean_json_response(response.text)
        if not content:
            return {
                "risk_score": "Unknown",
                "explanation": "No data available",
                "red_flags": []
            }
        return json.loads(content)
    except Exception as e:
        return {
            "risk_score": "Unknown",
            "explanation": f"Gemini parsing error: {e}",
            "red_flags": []
        }


def get_ai_insights(property_data):
    prompt = f"""
    Given this property data:
    - Bedrooms: {property_data.get("bedrooms")}
    - Bathrooms: {property_data.get("bathrooms")}
    - Sqft: {property_data.get("sqft")}
    - Rent: ${property_data.get("rent")}
    - NOI: ${property_data.get("noi")}
    - Year built: {property_data.get("year_built")}
    - Crime score: {property_data.get("crime_score")}
    - Area income: ${property_data.get("area_income")}

    Give 3 actionable insights that could improve ROI. Output JSON only:
    {{
        "recommendations": ["...", "...", "..."]
    }}
    """

    response = model.generate_content(prompt)
    try:
        content = clean_json_response(response.text)
        if not content:
            return {"recommendations": []}
        return json.loads(content)
    except Exception:
        return {"recommendations": []}


def run_full_analysis(data, t12_data=None, rent_roll_data=None):
    """
    Expects data like:
    {
        "purchase_price": 1000000,
        "noi": 75000,
        "cash_invested": 250000,
        "annual_cash_flow": 20000,
        "cash_flows": [-250000, 20000, 22000, 25000, 800000],  # optional
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 1200,
        "rent": 2500,
        "year_built": 1995,
        "crime_score": 6,
        "area_income": 62000
    }
    """
    cap_rate = calculate_cap_rate(data["noi"], data["purchase_price"])
    cash_on_cash = calculate_cash_on_cash(data["annual_cash_flow"], data["cash_invested"])
    irr = calculate_irr(data.get("cash_flows", []))

    # Merge extra info to pass into Gemini
    property_summary = {
        **data,
        "cap_rate": cap_rate,
        "cash_on_cash": cash_on_cash,
        "irr": irr,
    }

    risk = perform_risk_analysis(data["area_income"], data["crime_score"],  t12_data=t12_data or [], rent_roll_data=rent_roll_data or [])
    insights = get_ai_insights(data)

    return {
        "summary": property_summary,
        "risk_analysis": risk,
        "ai_recommendations": insights,
    }

def clean_json_response(response_text):
    """Extracts JSON from LLM response, removing code fences and handling errors."""
    # Step 0: Strip markdown-style code fences and "json" prefix
    response_text = response_text.strip()
    response_text = re.sub(r'^```json\s*|```$', '', response_text, flags=re.IGNORECASE)
    response_text = re.sub(r'^json\s*', '', response_text, flags=re.IGNORECASE)

    # Step 1: Extract JSON-like content
    match = re.search(r'(\{.*\})', response_text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in the response.")
    json_str = match.group(1)

    # Step 2: Remove control characters (ASCII < 32, except \t \n \r)
    json_str = ''.join(c for c in json_str if ord(c) >= 32 or c in '\n\r\t')

    # Step 3: Escape invalid backslashes in string literals
    def escape_backslashes_in_string(match):
        content = match.group(1)
        # Double all backslashes
        content = content.replace('\\', '\\\\')
        # Escape other special characters if needed
        content = content.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
        return '"' + content + '"'

    # Apply to all string literals (quoted content)
    json_str = re.sub(r'"(.*?)"', escape_backslashes_in_string, json_str, flags=re.DOTALL)

    # Step 4: Remove trailing commas
    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)

    return json_str

import pdfplumber

def extract_pdf_table_data(file_field):
    """
    Extract tabular data from the first page of a PDF.
    Returns list of rows as dictionaries.
    """
    table_data = []

    if not file_field:
        return table_data
    # Open the PDF file using pdfplumber
    if not file_field.endswith('.pdf'):
        print("Provided file is not a PDF.")
        return table_data
    if not os.path.exists(file_field):
        print(f"File not found: {file_field}")
        return table_data

    with pdfplumber.open(file_field) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue  # skip empty tables or no header

                headers = table[0]
                for row in table[1:]:
                    if len(row) != len(headers):
                        continue
                    row_data = {headers[i].strip(): row[i].strip() if row[i] else "" for i in range(len(headers))}
                    table_data.append(row_data)
            break  # Only use first page with valid table

    return table_data
