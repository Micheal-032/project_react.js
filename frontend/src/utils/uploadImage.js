import axios from 'axios';

/**
 * Uploads an image to Cloudinary based on environment variables.
 * Falls back to base64 encoding if Cloudinary is not configured.
 */
export const uploadImage = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        console.warn('Cloudinary not configured. Falling back to base64 encoding for image.');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    try {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const res = await axios.post(cloudinaryUrl, data);
        return res.data.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Image upload failed');
    }
};
