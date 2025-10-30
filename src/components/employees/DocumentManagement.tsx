'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Calendar,
  Tag,
  User,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '@/components/common/FileUpload';
import { fileUploadService, UploadedFile } from '@/services/fileUploadService';
import { Employee } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentManagementProps {
  employee: Employee;
  onDocumentUpdate?: () => void;
}

export default function DocumentManagement({ 
  employee, 
  onDocumentUpdate 
}: DocumentManagementProps) {
  const { currentUser, userProfile } = useAuth();
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<UploadedFile['category']>('document');

  const documentCategories = [
    { value: 'document', label: 'General Documents', icon: FileText },
    { value: 'contract', label: 'Contracts', icon: FileText },
    { value: 'certificate', label: 'Certificates', icon: FileText },
    { value: 'profile_photo', label: 'Profile Photos', icon: User }
  ] as const;

  useEffect(() => {
    loadDocuments();
  }, [employee.id]);

  const loadDocuments = async () => {
    if (!userProfile || !employee.id) return;
    
    try {
      setLoading(true);
      const employeeDocuments = await fileUploadService.getEmployeeDocuments(
        userProfile.organizationId,
        employee.id
      );
      setDocuments(employeeDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (uploadedFiles: UploadedFile[]) => {
    setDocuments(prev => [...prev, ...uploadedFiles]);
    setShowUpload(false);
    if (onDocumentUpdate) {
      onDocumentUpdate();
    }
  };

  const handleDeleteDocument = async (document: UploadedFile) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Extract file path from URL or use a stored path
      const filePath = `organizations/${userProfile!.organizationId}/employees/${employee.id}/${document.category}s/${document.name}`;
      await fileUploadService.deleteFile(filePath);
      
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      if (onDocumentUpdate) {
        onDocumentUpdate();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (document: UploadedFile) => {
    window.open(document.url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <User className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const isExpiringSoon = (document: UploadedFile) => {
    if (!document.metadata?.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (document.metadata.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (document: UploadedFile) => {
    if (!document.metadata?.expiryDate) return false;
    return document.metadata.expiryDate < new Date();
  };

  const groupedDocuments = documentCategories.reduce((acc, category) => {
    acc[category.value] = documents.filter(doc => doc.category === category.value);
    return acc;
  }, {} as Record<UploadedFile['category'], UploadedFile[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Document Management
          </h3>
          <p className="text-sm text-gray-500">
            Manage {employee.firstName} {employee.lastName}'s documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Categories */}
      {documentCategories.map((category) => {
        const categoryDocs = groupedDocuments[category.value] || [];
        const CategoryIcon = category.icon;

        return (
          <div key={category.value} className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <CategoryIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">{category.label}</h4>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {categoryDocs.length}
                </span>
              </div>
            </div>

            <div className="p-4">
              {categoryDocs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CategoryIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No {category.label.toLowerCase()} uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryDocs.map((document) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        {getFileIcon(document.type)}
                        <div className="flex space-x-1">
                          {isExpired(document) && (
                            <AlertTriangle className="w-4 h-4 text-red-500" aria-label="Expired" />
                          )}
                          {isExpiringSoon(document) && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" aria-label="Expiring Soon" />
                          )}
                        </div>
                      </div>

                      <h5 className="font-medium text-gray-900 mb-1 truncate">
                        {document.originalName}
                      </h5>
                      
                      <div className="text-xs text-gray-500 space-y-1 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(document.uploadedAt)}</span>
                        </div>
                        <div>{formatFileSize(document.size)}</div>
                        {document.metadata?.expiryDate && (
                          <div className={`flex items-center space-x-1 ${
                            isExpired(document) ? 'text-red-500' : 
                            isExpiringSoon(document) ? 'text-yellow-600' : ''
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>
                              Expires: {formatDate(document.metadata.expiryDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {document.metadata?.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {document.metadata.description}
                        </p>
                      )}

                      {document.metadata?.tags && document.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {document.metadata.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePreview(document)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(document)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded text-xs flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Document
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as UploadedFile['category'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {documentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <FileUpload
                category={selectedCategory}
                employeeId={employee.id}
                multiple={true}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                onUploadComplete={handleUploadComplete}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert(`Upload failed: ${error}`);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
