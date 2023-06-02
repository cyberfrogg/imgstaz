const sizeOf = require('image-size');

const GetImageDimensions = (imageBuffer: Buffer) => {
    const dimensions = sizeOf(imageBuffer);
    return dimensions;
}

export { GetImageDimensions }