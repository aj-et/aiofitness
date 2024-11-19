// lib/encryption.ts
export async function encrypt(content: string, key: string, iv: Uint8Array): Promise<string> {
    // Convert key to a CryptoKey
    const encodedKey = new TextEncoder().encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
  
    // Convert content to Uint8Array
    const encodedContent = new TextEncoder().encode(content);
  
    // Encrypt the content
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      cryptoKey,
      encodedContent
    );
  
    // Convert encrypted content to base64
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedContent))));
  }
  
export async function decrypt(encryptedContent: string, key: string, iv: Uint8Array): Promise<string> {
    // Convert key to a CryptoKey
    const encodedKey = new TextEncoder().encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  
    // Convert base64 encrypted content back to Uint8Array
    const binaryString = atob(encryptedContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
  
    // Decrypt the content
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      cryptoKey,
      bytes
    );
  
    // Convert decrypted content to string
    return new TextDecoder().decode(decryptedContent);
  }