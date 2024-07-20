

const BASE_URL = "https://geocode.xyz"


interface Coordinates {
    latitude: number,
    longitude: number
}

interface Address {
    buildingNumber: string,
    streetName: string,
    // locality: string,
    city: string,
    state: string,
    country: string,
    pincode: string
}


const getCoordinates = async(address: string): Promise<Coordinates> => {
    /**
     * Fetches the coordinates of the given address
     * 
     * @param address - The address for which the coordinates are to be fetched
     * @returns The coordinates of the given address
     */

    const response = await fetch(`${BASE_URL}/${address}?json=1`);
    const data = await response.json();

    if (!data.latt || !data.longt) {
        console.error(`No data found for the address: ${address}`);
    }

    return {
        latitude: data.latt,
        longitude: data.longt
    }

}


const getAddress = async(latitude: number, longitude: number): Promise<Address | null> => {
    /**
     * Fetches the address of the given coordinates
     * 
     * @param latitude - The latitude of the coordinates
     * @param longitude - The longitude of the coordinates
     * @returns The address of the given coordinates
     */

    if (!latitude || !longitude) {
        return null;
    }

    const response = await fetch(`${BASE_URL}/${latitude},${longitude}?json=1`);
    const data = await response.json();

    let postal: string = data?.postal || "";

    if (!data?.postal && data?.alt?.loc) {
        Array.from(data?.alt.loc).forEach((loc: any) => {
            if (loc.postal) {
                postal = loc.postal;
            }
        });
    }

    return {
        buildingNumber: data?.stnumber,
        streetName: data?.staddress,
        // locality: data?.standard.city,
        city: data?.osmtags.name,
        state: data?.state,
        country: data?.prov,
        pincode: postal
    }
}


// EXPORTED FUNCTIONS


const parseAddress = async(address: string): Promise<Address | null> => {
    /**
     * Parses the given address
     * 
     * @param address - The address to parse
     * @returns The parsed address
     */

    const coordinates = await getCoordinates(address)
    const addressInfo = await getAddress(coordinates.latitude, coordinates.longitude)

    return addressInfo;
}



export {
    parseAddress
}



