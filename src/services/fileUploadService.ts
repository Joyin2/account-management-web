import { supabase } from '@/lib/supabase';

export interface UploadedFile {
  id: string;
  name: string;
  original_name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
  uploaded_by: string;
  organization_id: string;
  category: 'profile_photo' | 'document' | 'contract' | 'certificate' | 'other';
  bucket_name: string;
  file_path: string;
  metadata?: {
    description?: string;
    tags?: string[];
    expiry_date?: string;
  };
}

export interface FileUploadProgress {
  file_id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileUploadOptions {
  category?: 'profile_photo' | 'document' | 'contract' | 'certificate' | 'other';
  description?: string;
  tags?: string[];
  expiry_date?: string;
  make_public?: boolean;
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
    'text/plain',
    'text/csv'
  ];

  private readonly DEFAULT_BUCKET = 'documents';

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { isValid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate unique file path
   */
  private generateFilePath(
    userId: string,
    organizationId: string,
    category: string,
    fileName: string
  ): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${organizationId}/${userId}/${category}/${timestamp}_${sanitizedFileName}`;
  }

  /**
   * Upload a single file to Supabase Storage
   */
  async uploadFile(
    file: File,
    userId: string,
    organizationId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const category = options.category || 'document';
      const filePath = this.generateFilePath(userId, organizationId, category, file.name);
      const bucketName = this.DEFAULT_BUCKET;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Save file metadata to database
      const fileRecord = {
        name: uploadData.path.split('/').pop() || file.name,
        original_name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        uploaded_by: userId,
        organization_id: organizationId,
        category,
        bucket_name: bucketName,
        file_path: filePath,
        metadata: {
          description: options.description,
          tags: options.tags,
          expiry_date: options.expiry_date
        },
        uploaded_at: new Date().toISOString()
      };

      const { data: savedFile, error: dbError } = await supabase
        .from('uploaded_files')
        .insert(fileRecord)
        .select()
        .single();

      if (dbError) throw dbError;

      return savedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    userId: string,
    organizationId: string,
    options: FileUploadOptions = {},
    onProgress?: (progress: FileUploadProgress[]) => void
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.uploadFile(file, userId, organizationId, options);
        
        if (onProgress) {
          onProgress([{
            file_id: result.id,
            progress: 100,
            status: 'completed'
          }]);
        }

        return result;
      } catch (error) {
        if (onProgress) {
          onProgress([{
            file_id: `temp_${index}`,
            progress: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          }]);
        }
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file record from database
      const { data: fileRecord, error: fetchError } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(fileRecord.bucket_name)
        .remove([fileRecord.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<UploadedFile | null> {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }

  /**
   * Get files by user
   */
  async getFilesByUser(
    userId: string,
    organizationId?: string,
    category?: string,
    limit?: number
  ): Promise<UploadedFile[]> {
    try {
      let query = supabase
        .from('uploaded_files')
        .select('*')
        .eq('uploaded_by', userId)
        .order('uploaded_at', { ascending: false });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting files by user:', error);
      throw error;
    }
  }

  /**
   * Get files by organization
   */
  async getFilesByOrganization(
    organizationId: string,
    category?: string,
    limit?: number
  ): Promise<UploadedFile[]> {
    try {
      let query = supabase
        .from('uploaded_files')
        .select('*')
        .eq('organization_id', organizationId)
        .order('uploaded_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting files by organization:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(
    fileId: string,
    metadata: {
      description?: string;
      tags?: string[];
      expiry_date?: string;
      category?: 'profile_photo' | 'document' | 'contract' | 'certificate' | 'other';
    }
  ): Promise<void> {
    try {
      const updateData: any = {};

      if (metadata.category) {
        updateData.category = metadata.category;
      }

      if (metadata.description !== undefined || 
          metadata.tags !== undefined || 
          metadata.expiry_date !== undefined) {
        // Get current metadata
        const { data: currentFile } = await supabase
          .from('uploaded_files')
          .select('metadata')
          .eq('id', fileId)
          .single();

        updateData.metadata = {
          ...currentFile?.metadata,
          ...(metadata.description !== undefined && { description: metadata.description }),
          ...(metadata.tags !== undefined && { tags: metadata.tags }),
          ...(metadata.expiry_date !== undefined && { expiry_date: metadata.expiry_date })
        };
      }

      const { error } = await supabase
        .from('uploaded_files')
        .update(updateData)
        .eq('id', fileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
  }

  /**
   * Search files
   */
  async searchFiles(
    searchTerm: string,
    userId?: string,
    organizationId?: string,
    category?: string
  ): Promise<UploadedFile[]> {
    try {
      let query = supabase
        .from('uploaded_files')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,original_name.ilike.%${searchTerm}%`)
        .order('uploaded_at', { ascending: false });

      if (userId) {
        query = query.eq('uploaded_by', userId);
      }

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  }

  /**
   * Get file download URL (for private files)
   */
  async getDownloadUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data: fileRecord, error: fetchError } = await supabase
        .from('uploaded_files')
        .select('bucket_name, file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase.storage
        .from(fileRecord.bucket_name)
        .createSignedUrl(fileRecord.file_path, expiresIn);

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(userId: string, organizationId?: string): Promise<{
    total_files: number;
    total_size: number;
    files_by_category: Record<string, number>;
    size_by_category: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_storage_stats', {
        p_user_id: userId,
        p_organization_id: organizationId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }

  /**
   * Clean up expired files
   */
  async cleanupExpiredFiles(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_files');

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
      throw error;
    }
  }

  /**
   * Create a shareable link for a file
   */
  async createShareableLink(
    fileId: string,
    expiresIn: number = 86400, // 24 hours
    allowDownload: boolean = true
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('create_shareable_link', {
        p_file_id: fileId,
        p_expires_in: expiresIn,
        p_allow_download: allowDownload
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating shareable link:', error);
      throw error;
    }
  }

  /**
   * Get files that are expiring soon
   */
  async getExpiringFiles(
    userId: string,
    organizationId?: string,
    daysAhead: number = 30
  ): Promise<UploadedFile[]> {
    try {
      const { data, error } = await supabase.rpc('get_expiring_files', {
        p_user_id: userId,
        p_organization_id: organizationId,
        p_days_ahead: daysAhead
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting expiring files:', error);
      throw error;
    }
  }

  /**
   * Bulk delete files
   */
  async bulkDeleteFiles(fileIds: string[]): Promise<void> {
    try {
      // Get file records
      const { data: fileRecords, error: fetchError } = await supabase
        .from('uploaded_files')
        .select('bucket_name, file_path')
        .in('id', fileIds);

      if (fetchError) throw fetchError;

      // Group files by bucket
      const filesByBucket: Record<string, string[]> = {};
      fileRecords.forEach(file => {
        if (!filesByBucket[file.bucket_name]) {
          filesByBucket[file.bucket_name] = [];
        }
        filesByBucket[file.bucket_name].push(file.file_path);
      });

      // Delete from storage
      for (const [bucketName, filePaths] of Object.entries(filesByBucket)) {
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove(filePaths);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .in('id', fileIds);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error bulk deleting files:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();
export default fileUploadService;
