from django.db import models
from django.contrib.auth.models import User

class Deal(models.Model):
    """
    Represents a real estate deal with details about the user, address, and property type.
    Attributes:
        user (ForeignKey): The user associated with the deal.
        address (CharField): The address of the property.
        city (CharField): The city where the property is located.
        state (CharField): The state where the property is located.
        zip_code (CharField): The ZIP code of the property's location.
        property_type (CharField): Type of property (e.g., residential, commercial).
        created_at (DateTimeField): Timestamp when the deal was created.
        fetched_data (JSONField): Auto-fetched or parsed data related to the deal.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    property_type = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Auto-fetched or parsed data
    fetched_data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.address
class AnalysisResult(models.Model):
    """
    Represents the analysis results for a real estate deal.

    Attributes:
        deal (OneToOneField): The deal associated with this analysis.
        cap_rate (FloatField): Capitalization rate of the deal.
        cash_on_cash (FloatField): Cash on cash return of the deal.
        irr (FloatField, optional): Internal rate of return, can be null or blank.
        pass_status (BooleanField): Indicates if the deal passed the analysis.
        recommendations (JSONField): Recommendations based on the analysis.
        created_at (DateTimeField): Timestamp when the analysis was created.
    """
    deal = models.OneToOneField(Deal, on_delete=models.CASCADE)
    cap_rate = models.FloatField()
    cash_on_cash = models.FloatField()
    irr = models.FloatField(null=True, blank=True)  # Optional
    pass_status = models.BooleanField(default=False)
    recommendations = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Analysis for {self.deal.address} - Pass: {self.pass_status}"

class UploadedDocument(models.Model):
    """
    Represents a document uploaded for a real estate deal.

    Attributes:
        deal (ForeignKey): The deal associated with the uploaded document.
        file (FileField): The uploaded document file.
        doc_type (CharField): Type of document (e.g., T12, Rent Roll).
        uploaded_at (DateTimeField): Timestamp when the document was uploaded.
        parsed_data (JSONField): Parsed data from the document, if available.
    """
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    DOC_TYPES = (('t12', 'T12'), ('rent_roll', 'Rent Roll'))
    doc_type = models.CharField(max_length=20, choices=DOC_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_data = models.JSONField(blank=True, null=True)
    def __str__(self):
        return f"{self.deal.address} - {self.doc_type}"

class ExportedFile(models.Model):
    """
    Represents a file exported from the system, such as a PDF or Excel model.
    Attributes:
        deal (ForeignKey): The deal associated with the exported file.
        file (FileField): The exported file.
        export_type (CharField): Type of export (e.g., PDF Summary, Excel Model).
        generated_at (DateTimeField): Timestamp when the file was generated.
    """
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    EXPORT_TYPES = (
        ('pdf', 'PDF Summary'),
        ('excel', 'Excel Model'),
        ('loi', 'Letter of Intent'),
    )
    file = models.FileField(upload_to='exports/')
    export_type = models.CharField(max_length=20, choices=EXPORT_TYPES)
    generated_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.deal.address} - {self.export_type}"

class FilterSetting(models.Model):
    """
    Represents user-defined filter settings for deals.
    Attributes:
        user (ForeignKey): The user who created the filter.
        name (CharField): Name of the filter.
        min_cap_rate (FloatField): Minimum cap rate for filtering deals.
        max_price (IntegerField, optional): Maximum price for filtering deals.
        year_built_min (IntegerField, optional): Minimum year built for filtering deals.
        created_at (DateTimeField): Timestamp when the filter was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default="My Filter")
    min_cap_rate = models.FloatField(default=0.0)
    max_price = models.IntegerField(blank=True, null=True)
    year_built_min = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
