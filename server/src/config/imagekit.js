import ImageKit from 'imagekit';

// Lazy initialization: ESM imports evaluate before dotenv.config() runs,
// so we create the client on first use instead of at import time.
let _imagekit = null;

const getClient = () => {
  if (!_imagekit) {
    _imagekit = new ImageKit({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return _imagekit;
};

/**
 * Upload a buffer (from Multer memory storage) to ImageKit.
 * @param {Buffer} file - file buffer
 * @param {string} fileName - desired file name
 * @param {string} folder - ImageKit folder path, e.g. '/events'
 * @returns {Promise<{url: string, fileId: string}>}
 */
export const uploadImage = async (file, fileName, folder = '/') => {
  const result = await getClient().upload({
    file: file.toString('base64'),
    fileName,
    folder,
    useUniqueFileName: true,
  });
  return { url: result.url, fileId: result.fileId };
};

/**
 * Delete an image from ImageKit by its fileId.
 */
export const deleteImage = async (fileId) => {
  try {
    await getClient().deleteFile(fileId);
  } catch (err) {
    // Don't crash the request if the image is already gone
    console.error(`ImageKit delete failed for ${fileId}: ${err.message}`);
  }
};