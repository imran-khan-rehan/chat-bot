const API_BASE_URL = 'https://custom-chatbot-ui-3.onrender.com';

export async function fetchUserDocuments(token: string) {
  try {
    // const token1="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0aW5nMTIzQGdtYWlsLmNvbSIsImV4cCI6MTcyOTUxMzkyNn0.AJcnfZavBataLRC_CcoOuAV_5D0KjRO4Pb0EtvLPQMY";
    const response = await fetch(`${API_BASE_URL}/chat/fetch_documents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch documents');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
}
export async function downloadDocument(documentId: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/chat/download_document/${documentId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to download document');
  }

  return response.json(); // Assuming it returns the document URL
}

export async function createChunks(documentId: number, documentUrl: string, token: string) {
  const encodedDocumentUrl = encodeURIComponent(documentUrl);
  const response = await fetch(`${API_BASE_URL}/chat/create_chunks/${documentId}?document_url=${encodedDocumentUrl}/${token}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create chunks');
  }

  return response.json(); // Assuming it returns the chunks URL
}
export async function setOpenAPIKey(token: string, apiKey: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/api_keys/openai/?api_key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({}) // Send an empty JSON object as the body, as per your cURL request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send OpenAI API key');
    }

    return response.json();
  } catch (error) {
    console.error('Error sending OpenAI API key:', error);
    throw error;
  }
}
export async function addDomain(token: string, domainRequest: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/users/add-domain?domain_request=${domainRequest}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({}) // Send an empty JSON object as the body, as per your cURL request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add domain');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding domain:', error);
    throw error;
  }
}



export async function setChunksUrl(documentId: number, chunksUrl: string, token: string) {
  const encodedChunkstUrl = encodeURIComponent(chunksUrl);
  const response = await fetch(`${API_BASE_URL}/chat/set_chunks_url/${documentId}?chunks_url=${encodedChunkstUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to set chunks URL');
  }

  return response.json();
}
// Function to create the FAISS index
export async function createFaissIndex(token: string, documentIds: number[], fineTune: boolean) {
  try {
    // Prepare the API URL with fine-tune parameter
    const apiUrl = `${API_BASE_URL}/chat/create_faiss_index?fine_tune=${fineTune}`;

    // Create the request payload as a JSON array of document IDs
    const requestBody = JSON.stringify(documentIds);

    // Make the POST request with fetch
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: requestBody,
    });

    // Check for successful response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create FAISS index');
    }

    // Return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error creating FAISS index:', error);
    throw error;
  }
}

export async function deleteDocument(token: string, documentId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
  
    return response.json();
  }
  export async function uploadDocument(token: string, file: File) {
    const formData = new FormData();
    
    // Append the file with the name 'files' as indicated by the backend
    formData.append('files', file, file.name);
  
    try {
      const response = await fetch(`${API_BASE_URL}/chat/upload_documents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Bearer token for authorization
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload document');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
  
// export async function uploadDocument(token: string, file: File) {
//   const token1="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbXJhbmtoYW4xOSIsImV4cCI6MTcyODkyMTgwNn0.PRTTT6ftHYQus4h9PX4Y_aPBuFeMmjJxH2RS271YN8I";

//   const formData = new FormData();
//   formData.append('file', file);
//   console.log(file);
//   try {
//     const response = await fetch(`${API_BASE_URL}/chat/upload_documents?token=${token1}`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || 'Failed to upload document');
//     }

//     return response.json();
//   } catch (error) {
//     console.error('Error uploading document:', error);
//     throw error;
//   }
// }

export async function queryChatbot(userId: number, question: string, sessionId: string) {
  try {
    // Construct the URL with query parameters
    console.log("ia m in api ts");
    const url = `${API_BASE_URL}/chat/query_openai/${userId}?question=${encodeURIComponent(question)}&session_id=${sessionId}`;

    const response = await fetch(url, {
      method: 'POST', // POST method, even with query parameters
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to query the chatbot');
    }

    // Return the response from the API
    return response.json();
  } catch (error) {
    console.error('Error querying chatbot:', error);
    throw error;
  }
}

export async function uploadTextFile(token: string, text: string, documentName: string) {
  //const apiUrl = 'https://custom-chatbot-ui-3.onrender.com/chat/upload_text_file';
  const url = `${API_BASE_URL}/chat/upload_text_file/?text=${encodeURIComponent(text)}&document_name=${encodeURIComponent(documentName)}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload text file');
    }

    console.log('Text file uploaded successfully');
  } catch (error) {
    console.error('Error uploading text file:', error);
  }
}

export async function extractFromUrls(urls: string[], token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/extract_from_urls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(urls), // Convert the array of URLs to JSON format
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to extract from URLs');
    }

    return await response.json(); // Return the extracted response
  } catch (error) {
    console.error('Error extracting from URLs:', error);
    throw error;
  }
}
export async function fetchChatHistory(chatId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/chat_history/${chatId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch chat history');
    }

    return await response.json(); // Return the chat history response
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}

