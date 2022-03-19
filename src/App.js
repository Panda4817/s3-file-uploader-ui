import React, { useState } from "react";
import FileUpload from "./components/file-upload/file-upload.component";
import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3"

const REGION = process.env.REACT_APP_REGION;
const BUCKET = process.env.REACT_APP_BUCKET_NAME;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
const SECRET = process.env.REACT_APP_AWS_SECRET_KEY;

function App() {
  const client = new S3Client({
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET }
  });
  const [files, setFiles] = useState([]);
  const [showUploadComplete, setShowUploadComplete] = useState(false);

  const updateUploadedFiles = (files) => {
    setFiles(files);
    setShowUploadComplete(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    files.map(async file => {
      let output = await client.send(new UploadPartCommand({ Body: file.file, Bucket: BUCKET, Key: file.key }));
      output.$metadata.httpStatusCode === 200 ? console.log("success") : console.log("failed");
    })
    console.log("upload complete");
    setFiles([]);
    setShowUploadComplete(true);
    setTimeout(() => setShowUploadComplete(false), 5000)

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept=".csv"
          label="S3 File Uploader UI"
          multiple
          updateFilesCb={updateUploadedFiles}
        />
        <button type="submit" onClick={handleSubmit}>Upload to S3 bucket</button>
        {showUploadComplete ? <h2>Upload complete</h2> : null}
      </form>
    </div>
  );
}

export default App;
