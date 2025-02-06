const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

let chatSession = null;

async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
}

async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");

    for (const name of files.map((file) => file.name)) {
        let file = await fileManager.getFile(name);
        while (file.state === "PROCESSING") {
            process.stdout.write(".")
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            file = await fileManager.getFile(name)
        }
        if (file.state !== "ACTIVE") {
            throw Error(`File ${file.name} failed to process`);
        }
    }
    console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function init() {

    const files = [
        await uploadToGemini("static/FEMA_CommunityDisasterResilienceZones.csv", "text/csv"),
        await uploadToGemini("static/uscounties.csv", "text/csv"),
    ];

    await waitForFilesActive(files);

    chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {
                        fileData: {
                            mimeType: files[0].mimeType,
                            fileUri: files[0].uri,
                        },
                    },
                    { text: "this is the data of all the community disaster resilience zones around US" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "Okay, I understand. You've provided a CSV file containing information about FEMA Community Disaster Resilience Zones. This is a large dataset with 1578 entries and many columns of interest. Here's a breakdown of the data and some initial observations, along with a plan for how we can analyze it further.\n\n**Data Structure**\n\nThe CSV file has the following columns:\n\n*   **OBJECTID:** A unique identifier for each record.\n*   **NRI ID:** A National Risk Index ID, likely a unique code for the geographical area.\n*   **State:** The name of the US state or territory.\n*   **State FIPS:** The Federal Information Processing Standard (FIPS) code for the state/territory.\n*   **County:** The name of the county (or equivalent).\n*   **County Type:** The type of county designation (e.g., Borough, Parish, County, Municipio).\n*  **County FIPS:** The FIPS code for the county.\n*   **Tract FIPS:**  The FIPS code for the census tract.\n*   **GEOID20:**  A 2020 Census Geoid identifier.\n*   **Shape\\_\\_Area:**  The area of the zone, likely in square meters, based on some values like `1.77292E+12`\n*   **Shape\\_\\_Length:** The perimeter of the zone, in meters.\n*   **CDRZ Designation Date:** The date when the area was designated as a Community Disaster Resilience Zone.\n*    **namelsad:** The name/label/description of the resilience zone.\n\n**Initial Observations & Potential Analysis Directions**\n\n1.  **Geographic Diversity:** The dataset covers many US states and territories, including Alaska, Puerto Rico, and CNMI (Northern Mariana Islands). This provides a broad geographic perspective on areas with resilience zone designations.\n2.  **Tribal Lands:** Several entries (especially towards the end of the file) indicate tribal lands/reservations, such as \"Osage Reservation\", \"Cherokee OTSA,\" \"Creek Nation,\" etc. This shows that FEMA is paying particular attention to the resilience of tribal nations.\n3. **Date Variability:** There are 3 unique date formats within the dataset. `20-Nov-24`, `06-Sep-23` and `10-Jan-25`. The majority of the data appears to be designated 2024, but data from 2023 and 2025 are also included.\n4.  **Area and Length:** The `Shape__Area` and `Shape__Length` columns reveal variations in the sizes of these resilience zones and there are values that are very large. This might indicate some are small communities and others are much larger.\n\n**Data Cleaning and Preprocessing**\n1.  **Fix Dates:** Parse dates into a consistent, machine-readable format for further processing and analysis, like year-month-day.\n2.  **Data Types:** Ensure that columns like FIPS codes are loaded correctly as strings (to keep leading zeros), and convert area/length to numerical types (if not already).\n3. **Handle missing values:** There are some entries where some values are missing. We should explore what kind of missing values they are and whether they are useful or not. \n\n**Analysis Plan**\n\nHere is a plan for extracting information from the dataset.\n1.  **Basic Statistics:**\n    *   Number of resilience zones per state.\n    *   Distribution of zone sizes (`Shape__Area` and `Shape__Length`).\n    *   Summary statistics by State or by County Type.\n2.  **Temporal Analysis:**\n    *   Examine the trend of resilience zone designations over time using the `CDRZ Designation Date`.\n    *   Identify the months or years with the highest number of designations.\n3.  **Tribal Lands Analysis:**\n    *   Filter the data to focus solely on tribal lands/reservations.\n    *   Explore the geographic distribution of tribal resilience zones.\n    *   Compare the sizes of tribal zones to non-tribal zones.\n4.  **Regional Analysis**\n    *   Group and analyze the data by state and look for trends or patterns within regions.\n5.  **Relationship between area and perimeter:**\n    *   Examine the relationship between the shape area and length to infer about the general shape of these zones.\n\n**Next Steps**\n\nTo begin, I will start by addressing some of the data loading and cleaning operations. Let me know if you have any specific questions you'd like me to address.\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        fileData: {
                            mimeType: files[1].mimeType,
                            fileUri: files[1].uri,
                        },
                    },
                    { text: "This is all the data of the counties around US" },
                ],
            },
            {
                role: "model",
                parts: [
                  { text: "Okay, I see. This is a JSON file (`fips_map.json`) that provides a mapping between FIPS codes (both state and county) and the corresponding geographical information. This is extremely useful and will allow us to perform spatial analysis and enhance our existing dataset with location information.\n\n**Data Structure**\n\nThe JSON file contains a dictionary where:\n*   **Keys:** FIPS codes as strings (e.g., \"1001\", \"2013\", etc). These appear to be county FIPS codes.\n*   **Values:** Dictionaries containing:\n    *   `state`: The state abbreviation (e.g., \"AL\", \"AK\", \"CA\").\n    *   `name`: The full name of the county (or equivalent entity like a census area or municipality).\n    *   `lat`: The latitude of the county's approximate centroid.\n    *   `long`: The longitude of the county's approximate centroid.\n\n**How This Data Will Be Used**\n\n1.  **Geo Enrichment:**  We can use this file to add latitude and longitude information to the main dataset (the CSV file). This will enable mapping and more detailed geographical analysis.\n2.  **State/County Validation:**  We can validate the `State` and `County` names against the FIPS codes provided in the main CSV file to ensure data consistency.\n3. **Spatial Analysis:** With lat/long we can compute distances, perform clustering or other spatial statistics.\n\n**Immediate Actions**\n\n1. **Load the JSON:** I will start by loading the JSON data into a suitable data structure (like a Python dictionary) for efficient lookup.\n2. **FIPS Code Alignment**: Both the `fips_map.json` and the `FEMA_CommunityDisasterResilienceZones.csv` files use FIPS codes, but the main CSV files include a state FIPS as well. So we will need to ensure we use the appropriate FIPS codes to correctly map the data.\n\n**Revised Analysis Plan**\n\nWith this new data, we can revise the analysis plan to include:\n\n1.  **Geographic Visualization:** We can use the lat/long coordinates to create maps displaying the resilience zones.\n2.  **Distance to population centers:** Based on coordinates, we can try and investigate if the zones are in close proximity to population centers, and what is the distance to major cities.\n3.  **Spatial Clusters:** Are there spatial clusters or patterns in the resilience zone locations, and is there are any correlation to vulnerability or other socioeconomic variables?\n\nI will now start with loading and preprocessing the data so we can begin this extended analysis.\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "You are an expert in telling the 5 nearest community disaster resilience zones on the basis of a county where the disaster is taking place. no explanation, only json format, object ids, county name, state name, longitude, latitude, distance"
                    }
                ]
            }
        ]
    });
}

// "Riverside (County), CA"
async function run(county) {
    if (!chatSession) {
        await init();
    }
    const result = await chatSession.sendMessage(county);
    return result.response.text();
}

module.exports = { run };
