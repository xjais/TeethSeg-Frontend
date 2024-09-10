// Azure Storage dependency
import { ContainerClient } from '@azure/storage-blob'

// Azure authentication for credential dependency
// const { DefaultAzureCredential } = require('@azure/identity');
import { DefaultAzureCredential } from '@azure/identity';

// For development environment - include environment variables from .env
// require("dotenv").config();


// Azure Storage resource name
const accountName = 'teethsegblob84ff' || process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error("Azure Storage accountName not found");

// Azure SDK needs base URL
const baseUrl = `https://${accountName}.blob.core.windows.net`;

// Unique container name
const timeStamp = Date.now();
const containerName = `azure-webjobs-secrets`;

export const newContainerClient = new ContainerClient(
  `${baseUrl}/${containerName}`,
  new DefaultAzureCredential()
);

// containerClient: ContainerClient object
// blobName: string, includes file extension if provided
// localFilePath: fully qualified path and file name
export async function uploadBlobFromLocalPath(containerClient, blobName, localFilePath) {
  // create container client from DefaultAzureCredential

  // Create blob client from container client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(localFilePath);
}

export async function listBlobsFlatWithPageMarker(containerClient) {

  // page size - artificially low as example
  const maxPageSize = 2;

  let i = 1;
  let marker;

  // some options for filtering list
  const listOptions = {
    includeMetadata: false,
    includeSnapshots: false,
    includeTags: false,
    includeVersions: false,
    prefix: ''
  };

  let iterator = containerClient.listBlobsFlat(listOptions).byPage({ maxPageSize });
  let response = (await iterator.next()).value;

  // Prints blob names
  for (const blob of response.segment.blobItems) {
    console.log(`Flat listing: ${i++}: ${blob.name}`);
  }

  // Gets next marker
  marker = response.continuationToken;

  // Passing next marker as continuationToken    
  iterator = containerClient.listBlobsFlat().byPage({
    continuationToken: marker,
    maxPageSize: maxPageSize * 2
  });
  response = (await iterator.next()).value;

  // Prints next blob names
  for (const blob of response.segment.blobItems) {
    console.log(`Flat listing: ${i++}: ${blob.name}`);
  }
}