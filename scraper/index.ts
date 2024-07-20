import { runPlaceQueriesInParallel } from "./gmapp_location_info";


const queries = [
    { query: "coffee", latitude: 28.6559457, longitude: 77.1404218 },
    // { query: "restaurant", latitude: 18.6559457, longitude: 47.1404218 },
    // { query: "hospital", latitude: 29.655457, longitude: -97.1404218 },
    // { query: "Starbucks", latitude: 26.8484046, longitude: 75.7215344 },
    // Add more queries here
];


async function main() {
    // start time
    const start = Date.now();

    // run the function
    const data = await runPlaceQueriesInParallel(queries);
    console.log(data);

    // end time
    const end = Date.now();

    console.log(`\nTime taken: ${(end - start) / 1000} secs`);
}

main();