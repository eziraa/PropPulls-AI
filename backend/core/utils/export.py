from django.core.files.base import ContentFile

def generate_pdf_summary(deal):
    """
    Generates a PDF summary for the given deal.
    This is a stub implementation that simulates PDF generation.
    In a real implementation, you would use a library like ReportLab or WeasyPrint.
    Args:
        deal (Deal): The deal object for which to generate the PDF summary.
    Returns:
        ContentFile: A file-like object containing the PDF content.
    """
    content = f"PDF Summary for Deal: {deal.address}\nCap Rate: 7%"
    return ContentFile(content.encode(), name=f'deal_{deal.id}_summary.pdf')


def generate_excel_model(deal):
    """
    Generates an Excel model for the given deal.
    This is a stub implementation that simulates Excel generation.
    In a real implementation, you would use a library like openpyxl or xlsxwriter.
    Args:
        deal (Deal): The deal object for which to generate the Excel model.
    Returns:
        ContentFile: A file-like object containing the Excel content.
    """
    content = "Excel model data (stub)..."
    return ContentFile(content.encode(), name=f'deal_{deal.id}_model.xlsx')


def generate_loi(deal):
    """
    Generates a Letter of Intent (LOI) for the given deal.
    This is a stub implementation that simulates LOI generation.
    In a real implementation, you would format the LOI according to legal standards.
    Args:
        deal (Deal): The deal object for which to generate the LOI.
    Returns:
        ContentFile: A file-like object containing the LOI content.
    """
    content = f"LOI for Deal at {deal.address}\nOffered Price: $500,000"
    return ContentFile(content.encode(), name=f'deal_{deal.id}_loi.txt')
