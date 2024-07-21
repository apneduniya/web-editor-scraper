import { ExifImage } from "exif";


function convertDMSToDD(dms: number[]) {
    /**
     * Converts Degrees Minutes Seconds (DMS) to Decimal Degrees (DD).
     * @param {number[]} dms - Array of three numbers representing degrees, minutes, and seconds.
     * @returns {number} - Decimal degrees.
     */

    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];
    return degrees + minutes / 60 + seconds / 3600;
}


// EXPORTED FUNCTIONS


function getImageGeolocation(buffer: Buffer): Promise<any | Error> {
    /**
     * Extracts the GPS coordinates from an image buffer.
     * @param {Buffer} - Image buffer.
     * @returns {Promise<GetImageGeolocationInterface | Error>} - Promise that resolves to an object containing the latitude and longitude of the image.
     */

    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: buffer }, (error, exifData) => {
                if (error) {
                    reject(error);
                } else {
                    // console.log(exifData, "\n");
            
                    if (exifData.gps && exifData.gps.GPSLatitude && exifData.gps.GPSLongitude) {
                        const latitude = convertDMSToDD(exifData.gps.GPSLatitude);
                        const longitude = convertDMSToDD(exifData.gps.GPSLongitude);
                        resolve({ latitude, longitude });
                    } else {
                        reject(new Error('Image does not contain GPS metadata.'));
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}


export { getImageGeolocation };


async function main() {
    // const fs = require('fs');
    // const path = require('path');
    // const buffer = fs.readFileSync(path.join(__dirname, 'image.jpg'));

    // URL to buffer via fetch
    const url = 'https://www.geoimgr.com/images/samples/england-london-bridge.jpg';
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    try {
        const geolocation = await getImageGeolocation(buffer);
        console.log(geolocation.latitude);
    } catch (error) {
        console.error(error);
    }
}

// main();


