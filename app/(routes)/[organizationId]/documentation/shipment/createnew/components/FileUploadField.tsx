import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext, useController } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { postData } from "@/axiosUtility/api";

interface FileUploadFieldProps {
  name: string;
  storageKey: string; // unique key for localStorage
  accept?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  name,
  storageKey,
  accept = ".pdf,.jpg,.jpeg,.png",
}) => {
  const { control, setValue } = useFormContext();
  const { field } = useController({ name, control });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    field.value || null
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedUrl = localStorage.getItem(storageKey);
    if (storedUrl) {
      setUploadedUrl(storedUrl);
      setValue(name, storedUrl);
    }
  }, [name, setValue, storageKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await postData("/shipmentdocsfile/upload", formData);

      const data = response;
      const url = data.url;
      setUploadedUrl(url);
      setValue(name, url);
      // localStorage.setItem(storageKey, url);
      setSelectedFile(null);

      toast.success("File uploaded!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setUploadedUrl(null);
    setValue(name, null);
    localStorage.removeItem(storageKey);
    toast.success("File deleted.");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={!!uploadedUrl}
          className="text-sm"
        />

        {uploadedUrl && (
          <>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View File"
              className="text-blue-600 hover:text-blue-800"
            >
              <EyeIcon className="h-4 w-4" />
            </a>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {selectedFile ? (
        <div
          className="text-xs text-gray-500 max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis"
          title={selectedFile.name}
        >
          Selected: {selectedFile.name}
        </div>
      ) : uploadedUrl ? (
        <div
          className="text-xs text-green-600 max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis"
          title={uploadedUrl.split("-").pop()}
        >
          Uploaded: {uploadedUrl.split("-").pop()}
        </div>
      ) : null}
      {!uploadedUrl && (
        <Button
          variant="secondary"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm mt-1 w-fit"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
        >
          Upload
        </Button>
      )}
    </div>
  );
};
