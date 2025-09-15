import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  organizationId: string;
  category: 'profile_photo' | 'document' | 'contract' | 'certificate' | 'other';
  metadata?: {
    description?: string;
    tags?: string[];
    expiryDate?: Date;
  };
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

class FileUploadService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  // Upload a single file
  async uploadFile(
    file: File,
    category: UploadedFile['category'],
    organizationId: string,
    userId: string,
    employeeId?: string,
    metadata?: UploadedFile['metadata'],
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<UploadedFile> {
    // Validate file
    this.validateFile(file);

    const fileId = uuidv4();
    const fileName = `${fileId}_${file.name}`;
    const filePath = this.getFilePath(category, organizationId, employeeId, fileName);
    
    try {
      // Create storage reference
      const storageRef = ref(storage, filePath);
      
      // Upload file with progress tracking
      if (onProgress) {
        onProgress({
          fileId,
          progress: 0,
          status: 'uploading'
        });
      }

      const uploadResult = await uploadBytes(storageRef, file, {
        customMetadata: {
          originalName: file.name,
          uploadedBy: userId,
          organizationId,
          category,
          ...(employeeId && { employeeId }),
          ...(metadata?.description && { description: metadata.description }),
          ...(metadata?.tags && { tags: JSON.stringify(metadata.tags) }),
          ...(metadata?.expiryDate && { expiryDate: metadata.expiryDate.toISOString() })
        }
      });

      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      if (onProgress) {
        onProgress({
          fileId,
          progress: 100,
          status: 'completed'
        });
      }

      return {
        id: fileId,
        name: fileName,
        originalName: file.name,
        url: downloadURL,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: userId,
        organizationId,
        category,
        metadata
      };
    } catch (error) {
      if (onProgress) {
        onProgress({
          fileId,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    category: UploadedFile['category'],
    organizationId: string,
    userId: string,
    employeeId?: string,
    metadata?: UploadedFile['metadata'],
    onProgress?: (progress: FileUploadProgress[]) => void
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(async (file, index) => {
      return this.uploadFile(
        file,
        category,
        organizationId,
        userId,
        employeeId,
        metadata,
        onProgress ? (progress) => {
          // Update progress for this specific file
          const allProgress = files.map((_, i) => ({
            fileId: i === index ? progress.fileId : `temp_${i}`,
            progress: i === index ? progress.progress : 0,
            status: i === index ? progress.status : 'uploading' as const
          }));
          onProgress(allProgress);
        } : undefined
      );
    });

    return Promise.all(uploadPromises);
  }

  // Delete a file
  async deleteFile(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get file metadata
  async getFileMetadata(filePath: string): Promise<any> {
    try {
      const storageRef = ref(storage, filePath);
      return await getMetadata(storageRef);
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List files in a directory
  async listFiles(directoryPath: string): Promise<UploadedFile[]> {
    try {
      const storageRef = ref(storage, directoryPath);
      const result = await listAll(storageRef);
      
      const filePromises = result.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        
        return {
          id: metadata.customMetadata?.fileId || itemRef.name,
          name: itemRef.name,
          originalName: metadata.customMetadata?.originalName || itemRef.name,
          url,
          size: metadata.size,
          type: metadata.contentType || 'unknown',
          uploadedAt: new Date(metadata.timeCreated),
          uploadedBy: metadata.customMetadata?.uploadedBy || 'unknown',
          organizationId: metadata.customMetadata?.organizationId || '',
          category: (metadata.customMetadata?.category as UploadedFile['category']) || 'other',
          metadata: {
            description: metadata.customMetadata?.description,
            tags: metadata.customMetadata?.tags ? JSON.parse(metadata.customMetadata.tags) : undefined,
            expiryDate: metadata.customMetadata?.expiryDate ? new Date(metadata.customMetadata.expiryDate) : undefined
          }
        } as UploadedFile;
      });

      return Promise.all(filePromises);
    } catch (error) {
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get employee documents
  async getEmployeeDocuments(organizationId: string, employeeId: string): Promise<UploadedFile[]> {
    const directoryPath = `organizations/${organizationId}/employees/${employeeId}/documents`;
    return this.listFiles(directoryPath);
  }

  // Get employee profile photos
  async getEmployeeProfilePhotos(organizationId: string, employeeId: string): Promise<UploadedFile[]> {
    const directoryPath = `organizations/${organizationId}/employees/${employeeId}/profile_photos`;
    return this.listFiles(directoryPath);
  }

  // Validate file before upload
  private validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
  }

  // Generate file path based on category and organization
  private getFilePath(
    category: UploadedFile['category'],
    organizationId: string,
    employeeId?: string,
    fileName?: string
  ): string {
    const basePath = `organizations/${organizationId}`;
    
    if (employeeId) {
      return `${basePath}/employees/${employeeId}/${category}s/${fileName}`;
    }
    
    return `${basePath}/${category}s/${fileName}`;
  }

  // Get file extension from filename
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Generate thumbnail for images (placeholder for future implementation)
  async generateThumbnail(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      return null;
    }
    
    // TODO: Implement image thumbnail generation
    // This could use canvas API or a library like sharp
    return null;
  }
}

export const fileUploadService = new FileUploadService();
