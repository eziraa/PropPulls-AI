
def parse_document(file, doc_type):
    """
    Simulated parsing logic.
    Real logic can use: PyPDF2, pandas, textract, etc.
    """
    if doc_type == 't12':
        return {
            "total_income": 120000,
            "total_expense": 40000,
            "net_operating_income": 80000
        }
    elif doc_type == 'rent_roll':
        return {
            "units": 10,
            "avg_rent": 1200,
            "occupancy_rate": 0.9
        }
    return {}
