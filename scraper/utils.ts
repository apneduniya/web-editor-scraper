

// SUPPORTING FUNCTIONS

import { parseAddress } from "./geocode_address_info";


const stringIsAValidUrl = (link: string, protocols: Array<string>): Boolean => {
    /**
     * This function will check if the given string is a valid URL.
     * 
     * @param link: string - The link to check
     * @param protocols: Array<string> - The valid protocols
     * @returns Boolean - True if the link is a valid URL, false otherwise
     */

    try {
        const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(link);
        const url = new URL(hasScheme? link : `https://${link}`);

        return protocols
            ? url.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};

const validatePhoneNumber = (phoneNumber: string): Boolean => {
    /**
     * This function will validate the phone number.
     * 
     * @param phoneNumber: string - The phone number to validate
     * @returns Boolean - True if the phone number is valid, false otherwise
     */

    const re = /^\+?(\d{1,4})?[-. ]?(\(?\d{1,4}\)?)?[-. ]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
    return re.test(phoneNumber);
};


// EXPORTED FUNCTIONS


const mapData = async (data: Array<string>): Promise<any> => {
    /**
     * This function will map the data to the correct fields.
     * 
     * @param data: Array<string> - The data to map
     * @returns Object - The mapped data
     */

    const addressObj = await parseAddress(data[0]);

    const result = {
        website: '',
        phoneNumber: '',
        ...addressObj
    };

    data.forEach(item => {
        if (validatePhoneNumber(item)) {
            result.phoneNumber = item;
        } else if (stringIsAValidUrl(item, ['https'])) {
            result.website = item;
        }
    });

    // Trim any extra whitespace
    // result.address = result.address.trim();

    return result;
};




export { mapData };


