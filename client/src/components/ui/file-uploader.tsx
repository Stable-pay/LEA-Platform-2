
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  maxFiles = 5,
  accept = '*'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles.slice(0, maxFiles));
  }, [maxFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxFiles,
    accept: accept.split(',').reduce((acc, curr) => ({
      ...acc,
      [curr]: []
    }), {})
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop files here, or click to select"}
        </p>
      </div>
      
      {acceptedFiles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {acceptedFiles.map((file) => (
            <Badge key={file.name} variant="secondary">
              {file.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilesSelected(acceptedFiles.filter(f => f !== file));
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
