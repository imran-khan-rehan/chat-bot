"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Grid, List, CheckCircle } from "lucide-react";
import { uploadDocument, fetchUserDocuments, deleteDocument, downloadDocument, setChunksUrl, createChunks, createFaissIndex } from '@/services/api';
import { Loader } from "@/components/ui/Loader"; // Import the loader
import DocumentSelectorPopup from '@/components/document-selector-popup';
import UploadSelectionPopup from '@/components/upload-selection-popup';

interface Document {
  id: number;
  filename: string;
  file_path: string;
}

export default function Page() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false); // Loader state for fetching documents
  const [isTrainingComplete, setIsTrainingComplete] = useState<boolean>(false); // Track if training is completed
  const [loading, setLoading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Progress bar state
  const [isUploading, setIsUploading] = useState<boolean>(false); // Track if upload is in progress
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState<boolean>(false); // State for upload selection popup

  const documentSelectorPopUp = async () => {
    setIsPopupOpen(true); // Show the document selector popup
  };

  const uploadSelectorPopUp = () => {
    setIsUploadPopupOpen(true); // Show the upload selection popup
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false); // Close the upload selection popup
  };
  const handleDocumentsUpdate = (newDocuments: Document[]) => {
    // Update the documents list with newly added documents
    setDocuments((prevDocuments) => [...prevDocuments, ...newDocuments]);
  };

  
  const handleStartTraining = async (selectedDocuments: number[]) => {
    console.log("Selected Documents in parent:", selectedDocuments);
    setIsPopupOpen(false);
  
    // Ensure the token is available
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to start training.");
      return;
    }
  
    try {
      console.log("Training started...");
      setLoading("Loading..."); // Show the loader
      setIsTrainingComplete(false); // Reset training state
  
      // Convert selectedDocuments to a comma-separated list of IDs for API calls
      const documentIds = selectedDocuments.join(",");
  
      // Loop over each selected document and process them one by one
      for (const docId of selectedDocuments) {
        try {
          // Step 1: Download document and get the document URL
          console.log("doc id:", docId);
          const downloadResponse = await downloadDocument(docId, token);
          console.log(`Document downloaded successfully: ${downloadResponse}`);
      
          // Step 2: Create chunks using the downloaded document URL
          if (downloadResponse) {
            try {
              const chunksUrl = await createChunks(docId, downloadResponse, token);
              console.log(`Chunks successfully created for document ID: ${docId}`);
      
              // Step 3: Set the chunks URL if chunks creation is successful
              if (chunksUrl) {
                const setChunksUrlResponse = await setChunksUrl(docId, chunksUrl, token);
                console.log(`Chunks URL successfully set for document ID: ${docId}`);
              } else {
                console.error(`Failed to set chunks URL for document ID: ${docId}`);
                setError(`Failed to set chunks URL for document ID: ${docId}`);
              }
            } catch (error) {
              console.error(`Failed to create chunks for document ID: ${docId}`);
            }
          } else {
            console.error(`Document download failed for document ID: ${docId}`);
            setError(`Document download failed for document ID: ${docId}`);
          }
        } catch (error) {
          console.error(`Error processing document ID: ${docId}`, error);
          setError(`Error processing document ID: ${docId}`);
          setIsTrainingComplete(false);
        }
      }
      
  
      // Step 4: Call createFaissIndex once after processing all documents
      const faissResponse = await createFaissIndex(token, selectedDocuments, false);
      if (faissResponse) {
        console.log(`FAISS index successfully created for all selected documents.`);
      } else {
        console.error(`Failed to create FAISS index for all selected documents.`);
        setError(`Failed to create FAISS index.`);
      }
  
      setLoading(null); // Hide the loader
      setIsTrainingComplete(true); // Mark training as complete
      console.log("Training completed.");
    } catch (error) {
      console.error("An error occurred during training", error);
      setError("An error occurred during training.");
      setLoading(null); 
    }
  };
  

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  useEffect(() => {
    const storedToken =localStorage.getItem("token"); //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0aW5nMTIzQGdtYWlsLmNvbSIsImV4cCI6MTcyOTUxMzkyNn0.AJcnfZavBataLRC_CcoOuAV_5D0KjRO4Pb0EtvLPQMY";
    // alert(storedToken);
    if (storedToken) {
      setToken(storedToken);
      fetchDocuments(storedToken);
    } else {
      setError('You need to log in to access documents.');
    }
  }, []);

  const fetchDocuments = async (token: string) => {
    try {
      setLoadingDocuments(true); // Start the loader
      const userDocuments = await fetchUserDocuments(token);
      console.log("fetching document response:", userDocuments);
      const formattedDocs = userDocuments.map((doc: any) => ({
        id: doc.id,
        filename: doc.filename,
        file_path: doc.file_path
      }));
      setDocuments(formattedDocs);
      setLoadingDocuments(false); // Stop the loader
    } catch (error) {
      setLoadingDocuments(false); // Stop the loader on error
      // setError('An error occurred while fetching documents');
    }
  };

  const confirmDelete = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true); // Show the confirmation modal
  };
  const handleDelete = async () => {
    if (token && selectedDocument) {
      try {
        await deleteDocument(token, selectedDocument.id.toString());
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== selectedDocument.id));
        setError(null);
        setIsDeleteModalOpen(false); // Close the modal after deletion
      } catch (error) {
        setError('An error occurred while deleting the document.');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close modal without deleting
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && token) {
      setIsUploading(true); // Start the progress bar
      setUploadProgress(0); // Reset progress

      const fakeUploadDuration = 5000; // Simulate 5 seconds upload duration
      const progressIncrement = 100 / (fakeUploadDuration / 100); // Increment every 100ms

      // Simulate the progress bar by gradually increasing it
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval); // Stop when it reaches 100%
            return 100;
          }
          return prev + progressIncrement;
        });
      }, 100);

      try {
        const uploadedDocumentArray = await uploadDocument(token, file); 
        const uploadedDocument = uploadedDocumentArray[0]; 
        const formattedDocs = {
          id: uploadedDocument.id,
          filename: uploadedDocument.filename,
          file_path: uploadedDocument.file_path
        };
        clearInterval(progressInterval);
        setIsUploading(false); 
        setDocuments((prevDocuments) => [...prevDocuments, formattedDocs]); 
        setError(null);
      } catch (error) {
        setIsUploading(false);
        setError('An error occurred during the upload');
      }
    } else {
      setError('You must be logged in to upload documents.');
    }
  };
  const toggleView = () => {
    setIsGridView(prev => !prev);
  };
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full text-black mx-auto mt-8 p-6 bg-white rounded-lg shadow-md ml-4">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Document Manager</h1>
      <Button onClick={toggleView} variant="outline" size="icon">
        {isGridView ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        <span className="sr-only">{isGridView ? 'Switch to list view' : 'Switch to grid view'}</span>
      </Button>
    </div>

    <div className="mb-6">
      <Input
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt"
        className="sr-only"
        ref={fileInputRef}
      />
        <Button onClick={triggerFileInput}>
              <Upload className="w-4 h-3 mr-2" />
              File
        </Button> 
      <Button onClick={uploadSelectorPopUp} className="ml-6 mb-10">Upload</Button>
      <Button onClick={documentSelectorPopUp} className="ml-6 mb-10">Start Training</Button>

      {/* Progress bar for file upload */}
      {isUploading && (
          <div className="w-full bg-gray-300 rounded-full h-4 mt-4 mb-2">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="mt-2 text-sm text-gray-500 text-center">{Math.round(uploadProgress)}% Uploading</p>
          </div>
        )}

      {/* Show loader while training is in progress */}
      {loading && (
        <div className="text-center mt-2">
          <Loader /> {/* Your custom loader */}
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200 mt-2">
              Training in Progress
            </span>
          </div>
        </div>
      )}

      {/* Show tick and success message when training is complete */}
      {isTrainingComplete && (
        <div className="flex items-center justify-center space-x-2 mt-4 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <p>Training Completed</p>
        </div>
      )}
    </div>
    

    {error && <p className="text-red-500 mb-4">{error}</p>}

    {loadingDocuments ? (
      <div className="text-center">
        <Loader /> {/* Loader with Tailwind spinner */}
        <p>Loading documents...</p>
      </div>
    ) : documents.length === 0 ? (
      <p className="text-gray-500 text-center">No documents uploaded yet.</p>
    ) : (
      <>
        {isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-gray-100 p-4 rounded-lg relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDelete(doc)}
                  className="absolute top-2 right-2"
                  aria-label={`Delete ${doc.filename}`}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="mt-4">
                  <p className="font-medium truncate">{doc.filename}</p>
                  {doc.file_path && (
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {doc.filename}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  {doc.file_path && (
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View Document
                    </a>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDelete(doc)}
                  aria-label={`Delete ${doc.filename}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </>
    )}
     {/* Delete Confirmation Modal */}
     {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete <strong>{selectedDocument?.filename}</strong>?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancelDelete}>No</Button>
              <Button variant="destructive" onClick={handleDelete}>Yes</Button>
            </div>
          </div>
        </div>
      )}
      {/* Document Selector Popup */}
      {isPopupOpen && <DocumentSelectorPopup isOpen={isPopupOpen} onClose={handleClosePopup} onStartTraining={handleStartTraining} />}
      {isUploadPopupOpen && (
        <UploadSelectionPopup 
          isOpen={isUploadPopupOpen} 
          onClose={handleCloseUploadPopup} 
          onDocumentsUpdate={handleDocumentsUpdate} 
        />
      )}

  </div>
  );
}
