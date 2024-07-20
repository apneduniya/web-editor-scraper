import { runPlaceQueriesInParallel } from "./gmapp_location_info";
import { getImageGeolocation } from "./image_geolocation";


const queries = [
    { query: "coffee", latitude: 28.6559457, longitude: 77.1404218 },
    // { query: "restaurant", latitude: 18.6559457, longitude: 47.1404218 },
    // { query: "hospital", latitude: 29.655457, longitude: -97.1404218 },
    // { query: "Starbucks", latitude: 26.8484046, longitude: 75.7215344 },
    // Add more queries here
];

const imageURLQueries = [
    // {
    //     query: "London Bridge",
    //     url: "https://www.geoimgr.com/images/samples/england-london-bridge.jpg"
    // },
    {
        query: "Dingle town in Ireland",
        url: "https://lh3.googleusercontent.com/pw/AP1GczMhMgDybAlRW0DW-ZaZWLftC0OfiPmrXo1wEMXMjMK4XsGq81l0epbvliWQkcEMFsCGpVGHe5WXCkAuh05pWcDuJDB0_3LG6QoVZPTVG8y_D2D0s3BHD2kcceYe4gFM-PtGsHdSB-WVZdyyuAVx0_nZ=w1709-h1013-s-no-gm?authuser=0"
    }
]


async function mainQueries() {
    // start time
    const start = Date.now();

    // run the function
    const data = await runPlaceQueriesInParallel(queries);
    console.log(data);

    // end time
    const end = Date.now();

    console.log(`\nTime taken: ${(end - start) / 1000} secs`);
}


async function main() {
    // start time
    const start = Date.now();

    const q: Array<any> = [];

    // Use map to create an array of promises
    const promises = imageURLQueries.map(async (item) => {
        const response = await fetch(item.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        try {
            const data = await getImageGeolocation(buffer);
            // console.log({ query: item.query, latitude: data.latitude, longitude: data.longitude });
            q.push({ query: item.query, latitude: data.latitude, longitude: data.longitude });
        } catch (error) {
            console.error(error);
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // run the function
    const data = await runPlaceQueriesInParallel(q);
    console.log(data);

    // end time
    const end = Date.now();

    console.log(`\nTime taken: ${(end - start) / 1000} secs`);
}



main();