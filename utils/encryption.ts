import { encrypt, decrypt } from "@/lib/encryption";

interface EncryptedMessage {
  content: string;
  iv: string;
}

export const encryptMessage = async (content: string, key: string): Promise<EncryptedMessage> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedContent = await encrypt(content, key, iv);
  return {
    content: encryptedContent,
    iv: Buffer.from(iv).toString('base64')
  };
};

export const decryptMessage = async (
  encryptedMessage: EncryptedMessage,
  key: string
): Promise<string> => {
  const iv = Buffer.from(encryptedMessage.iv, 'base64');
  return await decrypt(encryptedMessage.content, key, iv);
};