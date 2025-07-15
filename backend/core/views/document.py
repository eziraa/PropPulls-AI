
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  permissions
from django.shortcuts import get_object_or_404

from core.models import Deal, UploadedDocument
from core.serializers.document import UploadedDocumentSerializer
from core.utils.parse_document import parse_document

class DocumentUploadAPIView(APIView):
    """
    Handles uploading and parsing documents for a specific deal.
    POST: Upload a document and parse it based on its type.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        file = request.FILES.get('file')
        doc_type = request.data.get('doc_type')

        if not file or not doc_type:
            return Response({'error': 'File and doc_type are required.'}, status=400)

        # Parse document
        parsed_data = parse_document(file, doc_type)

        document = UploadedDocument.objects.create(
            deal=deal,
            file=file,
            doc_type=doc_type,
            parsed_data=parsed_data
        )

        return Response(UploadedDocumentSerializer(document).data, status=201)


class DealDocumentsAPIView(APIView):
    """
    Handles listing all documents for a specific deal.
    GET: List all documents for a deal by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        deal = get_object_or_404(Deal, pk=pk, user=request.user)
        documents = UploadedDocument.objects.filter(deal=deal)
        serializer = UploadedDocumentSerializer(documents, many=True)
        return Response(serializer.data)


class DocumentDetailAPIView(APIView):
    """
    Handles retrieving and deleting a specific document.
    GET: Retrieve a document by ID.
    DELETE: Delete a document by ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, doc_id):
        document = get_object_or_404(UploadedDocument, pk=doc_id, deal__user=request.user)
        serializer = UploadedDocumentSerializer(document)
        return Response(serializer.data)

    def delete(self, request, doc_id):
        document = get_object_or_404(UploadedDocument, pk=doc_id, deal__user=request.user)
        document.file.delete(save=False)  # Delete the file from storage
        document.delete()
        return Response(status=204)
