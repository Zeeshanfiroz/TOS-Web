import { useEffect, useRef, useState } from 'react';

export default function ImageUploadDropzone({
  label,
  value,
  onChange,
  multiple = false,
  accept = 'image/*',
  helperText,
  placeholder = 'Drag and drop image here',
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedFiles = Array.isArray(value) ? value : value ? [value] : [];
  const firstSelectedFile = selectedFiles[0];
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const firstFile = firstSelectedFile;
    if (!firstFile?.type?.startsWith('image/')) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(firstFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [firstSelectedFile]);

  const handleFiles = (fileList) => {
    if (!fileList || !fileList.length || disabled) return;

    if (multiple) {
      onChange(Array.from(fileList));
      return;
    }

    onChange(fileList[0]);
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const handlePaste = (event) => {
    if (disabled) return;

    const pastedImages = Array.from(event.clipboardData?.items || [])
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter(Boolean);

    if (!pastedImages.length) return;

    event.preventDefault();
    if (multiple) {
      onChange([...selectedFiles, ...pastedImages]);
    } else {
      onChange(pastedImages[0]);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onPaste={handlePaste}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label || 'Upload image'}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={[
          'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-all',
          isDragging ? 'border-forest-500 bg-forest-50' : 'border-gray-200 bg-gray-50 hover:border-forest-300 hover:bg-forest-50/60',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="mb-3 w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
            <img src={previewUrl} alt="Selected upload preview" className="h-32 w-full object-cover" />
          </div>
        ) : (
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 text-forest-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M5 18.5A2.5 2.5 0 0 0 7.5 21h9A2.5 2.5 0 0 0 19 18.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        <p className="text-sm font-medium text-gray-700">
          {isDragging ? 'Drop the image here' : placeholder}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {multiple ? 'Click, drop, or paste multiple images' : 'Click, drop, or paste an image'}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          {multiple ? `${selectedFiles.length} image(s) selected` : selectedFiles[0]?.name}
        </div>
      )}

      {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}