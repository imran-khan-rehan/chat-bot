import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchUserDocuments } from '@/services/api' // Assuming the API function is defined here

interface Document {
  id: number;
  filename: string;
  file_path: string;
  chunks_file_path: string | null;
  user_id: number;
}

interface DocumentSelectorPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onStartTraining: (selectedDocuments: number[]) => void;
}

export default function DocumentSelectorPopup({ isOpen = true, onClose = () => {}, onStartTraining }: DocumentSelectorPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [documents, setDocuments] = useState<Document[]>([])


  const handleStartTraining = () => {
    onStartTraining(selectedDocuments);
  };

  // Fetch documents when the component is mounted or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      const fetchDocuments = async () => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
          try {
            const userDocuments = await fetchUserDocuments(token);
            // Filter documents where chunks_file_path is null
            const filteredDocs = userDocuments.filter((doc: Document) => doc.chunks_file_path === null);
            setDocuments(filteredDocs);
          } catch (error) {
            console.error('Error fetching documents:', error);
          }
        }
      };
      fetchDocuments();
    }
  }, [isOpen]);

  // Filter the documents based on the search term
  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleDocumentSelection = (id: number) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    )
    console.log("selected-doc: ",selectedDocuments);
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Untrained Documents</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDocuments.map(doc => (
          <div key={doc.id} className="flex items-center space-x-3 py-2">
            <Checkbox
              id={`doc-${doc.id}`}
              checked={selectedDocuments.includes(doc.id)}
              onCheckedChange={() => toggleDocumentSelection(doc.id)}
            />
            <label htmlFor={`doc-${doc.id}`} className="flex-1 cursor-pointer">
              {doc.filename}
            </label>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <Button onClick={handleStartTraining} className="w-full" disabled={selectedDocuments.length === 0}>
          Start
        </Button>
      </div>
    </div>
  </div>
  
  )
}
