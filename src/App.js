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
  const [mappingFiles, setMappingFiles] = useState([]);

  const updateUploadedFiles = (files) =>
    setMappingFiles(files);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submit working")
    mappingFiles.map(async file => {
      let output = await client.send(new UploadPartCommand({ Body: file.file, Bucket: BUCKET, Key: file.key }));
      console.log(output.$metadata.httpStatusCode);
    })

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept=".csv"
          label="Mapping files"
          multiple
          updateFilesCb={updateUploadedFiles}
        />
        <button type="submit" onClick={handleSubmit}>Upload to S3 bucket</button>
      </form>
    </div>
  );
}

export default App;
