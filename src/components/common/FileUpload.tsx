'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { fileUploadService, UploadedFile, FileUploadProgress } from '@/services/fileUploadService';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadProps {
  category: UploadedFile['category'];
  employeeId?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface FileWithProgress extends File {
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}

export default function FileUpload({
  category,
  employeeId,
  multiple = false,
  accept,
  maxSize = 10,
  onUploadComplete,
  onUploadError,
  className = '',
  disabled = false
}: FileUploadProps) {
  const { currentUser, userProfile } = useAuth();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || !currentUser || !userProfile) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles: FileWithProgress[] = fileArray.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading'
    }));

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);

    // Start uploading files
    newFiles.forEach(async (file) => {
      try {
        const uploadedFile = await fileUploadService.uploadFile(
          file,
          category,
          userProfile.organizationId,
          currentUser.uid,
          employeeId,
          undefined,
          (progress: FileUploadProgress) => {
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: progress.progress, status: progress.status, error: progress.error }
                : f
            ));
          }
        );

        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, uploadedFile, status: 'completed' }
            : f
        ));

        // Call completion callback
        if (onUploadComplete) {
          const completedFiles = files
            .filter(f => f.status === 'completed' && f.uploadedFile)
            .map(f => f.uploadedFile!);
          completedFiles.push(uploadedFile);
          onUploadComplete(completedFiles);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        ));
        
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    });
  }, [category, employeeId, currentUser, userProfile, multiple, onUploadComplete, onUploadError, files]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragOver ? 'Drop files here' : 'Upload files'}
        </p>
        <p className="text-sm text-gray-500">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Maximum file size: {maxSize}MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            {multiple ? 'Uploaded Files' : 'Uploaded File'}
          </h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {getFileIcon(file)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                
                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {file.progress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {file.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {file.status === 'uploading' && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(file.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={file.status === 'uploading'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {files.some(f => f.status === 'error') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Upload Errors
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {files
                    .filter(f => f.status === 'error')
                    .map(f => (
                      <li key={f.id}>
                        {f.name}: {f.error}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
