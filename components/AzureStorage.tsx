import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
global.Buffer = Buffer;

const accountName = "ststein";
const sasToken =
  "sp=racwdl&st=2025-05-27T20:50:30Z&se=2025-05-28T04:50:30Z&spr=https&sv=2024-11-04&sr=c&sig=w4f6kmPW7mVIb3sqRfKfuBoYFg54kiBjlb3vqKx%2BSHM%3D";
const accountURL = `https://${accountName}.blob.core.windows.net?${sasToken}`;
const blobServiceClient = new BlobServiceClient(accountURL);

export async function SubmitMedia(
  eventId: string,
  localFilePath: string
): Promise<void> {
  try {
    const containerClient = blobServiceClient.getContainerClient("memory-dump");
    const fileExtension = localFilePath.split(".").pop() || "bin";
    const blobName = `${eventId}/${uuidv4()}.${fileExtension}`;

    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    const response = await fetch(localFilePath);
    const blobData = await response.blob();
    await blockBlobClient.uploadData(blobData);
  } catch (e) {
    console.error(e);
  }
}
