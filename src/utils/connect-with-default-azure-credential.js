// Azure Storage dependency
const {
  StorageSharedKeyCredential,
  BlobServiceClient,
} = require("@azure/storage-blob");

// For development environment - include environment variables from .env
require("dotenv").config();

// Azure Storage resource name
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error("Azure Storage accountName not found");

// Azure Storage resource key
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
if (!accountKey) throw Error("Azure Storage accountKey not found");

// Create credential
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const baseUrl = `https://${accountName}.blob.core.windows.net`;
const containerName = `my-container`;

// Create BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `${baseUrl}`,
  sharedKeyCredential
);

// containerClient: ContainerClient object
// blobName: string, includes file extension if provided
// localFilePath: fully qualified path and file name
async function uploadBlobFromLocalPath(containerClient, blobName, localFilePath) {
  // Create blob client from container client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(localFilePath);
}

async function main() {
  try {
    // Create container client
    const containerClient = await blobServiceClient.getContainerClient(
      containerName
    );

    // do something with containerClient...
    let i = 1;

    // List blobs in container
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log(`Blob ${i++}: ${blob.name}`);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

main()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(ex.message));