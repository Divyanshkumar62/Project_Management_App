import React, { useState } from "react";

const AttachmentUploader = ({
  onUpload,
  disabled,
  accept = "",
  maxSizeMB = 5,
}) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    const selected = e.target.files[0];
    if (!selected) return;
    if (maxSizeMB && selected.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }
    if (
      accept &&
      !accept
        .split(",")
        .some((type) => selected.name.toLowerCase().endsWith(type.trim()))
    ) {
      setError("Invalid file type");
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      await onUpload(file, setProgress);
      setFile(null);
      setProgress(0);
    } catch (e) {
      setError(e.message || "Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        accept={accept}
      />
      {file && (
        <div className="flex items-center gap-2">
          <span>{file.name}</span>
          <button
            onClick={handleUpload}
            disabled={disabled}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Upload
          </button>
        </div>
      )}
      {progress > 0 && (
        <progress value={progress} max={100} className="w-full" />
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default AttachmentUploader;
