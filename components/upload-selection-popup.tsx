import { useState, useEffect } from 'react';
import { X, Link, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { uploadTextFile, fetchUserDocuments, extractFromUrls } from '@/services/api';

interface Document {
  id: number;
  filename: string;
  file_path: string;
}

interface UploadSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentsUpdate: (newDocuments: Document[]) => void; // New prop to pass updated documents
}

export default function UploadSelectionPopup({ isOpen, onClose, onDocumentsUpdate }: UploadSelectionPopupProps) {
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  if (!isOpen) return null;

  const handleTrain = async () => {
    if (!token) {
      setError('You need to log in to perform this action.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let newDocuments: Document[] = [];
      const fakeUploadDuration = 5000; // Simulate 4 seconds upload duration
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

      const existingDocuments = await fetchUserDocuments(token);

      if (inputMode === 'url') {
        const urlList = url.split(',').map((item) => item.trim()).filter(Boolean);
        const uploadTextResponse = await extractFromUrls(urlList, token);
        newDocuments = uploadTextResponse.uploaded_documents.map((doc: any) => ({
          id: doc.id,
          filename: doc.filename,
          file_path: doc.file_path,
        }));
      } else {
        await uploadTextFile(token, text, documentName);
      }
      const updatedDocuments = await fetchUserDocuments(token);

    // Step 3: Find the newly added documents by comparing with the previous state
      newDocuments = updatedDocuments.filter(
        (doc: any) => !existingDocuments.some((existingDoc: any) => existingDoc.id === doc.id)
      ).map((doc: any) => ({
        id: doc.id,
        filename: doc.filename,
        file_path: doc.file_path,
      }));

      // Update documents in the parent component
      onDocumentsUpdate(newDocuments);
      setIsUploading(false);
    } catch (error) {
      console.error('Error during training:', error);
      setError('Error during training. Please try again.');
      setIsUploading(false);
    }
  };

  // Effect to retrieve the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('You need to log in to access documents.');
    }
  }, []);

  // Effect to close the popup when progress reaches 100%
  useEffect(() => {
    if (uploadProgress === 100) {
        onClose();
    }
  }, [uploadProgress, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Upload Content</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <Tabs value={inputMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" onClick={() => setInputMode('url')}>
                <Link className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="text" onClick={() => setInputMode('text')}>
                <FileText className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="mt-4">
              <Input
                type="url"
                placeholder="Enter URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </TabsContent>
            <TabsContent value="text" className="mt-4">
              <Label htmlFor="documentName" className="text-sm font-medium text-gray-700">
                Document Name
              </Label>
              <Input
                id="documentName"
                type="text"
                placeholder="Enter document name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full"
              />
              <Label htmlFor="textContent" className="text-sm font-medium text-gray-700">
                Text Content
              </Label>
              <Textarea
                id="textContent"
                placeholder="Enter your text here"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32"
              />
            </TabsContent>
          </Tabs>

          {/* Progress bar for API call */}
          {isUploading && (
            <div className="w-full bg-gray-300 rounded-full h-4 mt-4 mb-2">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                {Math.round(uploadProgress)}% Processing
              </p>
            </div>
          )}

          <div className="flex justify-center items-center pt-4">
            <Button onClick={handleTrain} disabled={isUploading}>
              Train
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
