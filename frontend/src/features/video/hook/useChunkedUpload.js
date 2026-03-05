import { useCallback, useRef, useState } from "react";
import { VideoService } from "../services/video.services.js";

export function useChunkedUpload(chunkSize = 5 * 1024 * 1024) {
   const [progress, setProgress] = useState(0);
   const [isUploading, setIsUploading] = useState(false);
   const [error, setError] = useState(null);
   const [uploadId, setUploadId] = useState(null);
   const [key, setKey] = useState(null);
   const abortRef = useRef(false);

   const reset = useCallback(() => {
      setProgress(0);
      setIsUploading(false);
      setError(null);
      setUploadId(null);
      setKey(null);
      abortRef.current = false;
   }, []);

   const startUpload = useCallback(async (file) => {
      if (!file) return;
      reset();
      abortRef.current = false;
      setIsUploading(true);
      try {
         const { uploadId: id, key: uploadKey } = await VideoService.startChunkedUpload();
         setUploadId(id);
         setKey(uploadKey);

         const totalParts = Math.ceil(file.size / chunkSize);
         let partNumber = 1;
         const parts = [];
         for (let start = 0; start < file.size; start += chunkSize) {
            if (abortRef.current) throw new Error("Upload aborted");
            const chunk = file.slice(start, start + chunkSize);
            const formData = new FormData();
            formData.append("chunk", chunk);
            formData.append("partNumber", partNumber);
            formData.append("key", uploadKey);
            const { ETag, PartNumber: partNumberfromBackend} = await VideoService.uploadChunk(id, formData);
            parts.push({ ETag, PartNumber: partNumberfromBackend });
            setProgress(Math.round((partNumber / totalParts) * 100));
            partNumber++;
         }

         await VideoService.completeChunkedUpload(id, uploadKey, parts);
      } catch (err) {
         setError(err.message);
         throw err;
      } finally {
         setIsUploading(false);
      }
   }, [chunkSize, reset]);

   return {
      progress, isUploading, error, uploadId, key,
      startUpload,
      abort: () => { abortRef.current = true; },
   };
}
