import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient();

// Form ID provided by the user
const FORM_ID = 'cmeartfgt001yl0s25dl8lb1r';

// Function to generate random names
function generateRandomName(): string {
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
    'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Hayden', 'Jamie',
    'Kendall', 'Logan', 'Marley', 'Parker', 'Peyton', 'Reese', 'River', 'Rowan',
    'Sage', 'Skyler', 'Sydney', 'Tanner', 'Teagan', 'Wren', 'Zion', 'Aria',
    'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper',
    'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia',
    'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe',
    'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas',
    'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan',
    'Jackson', 'Levi', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Aiden'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Function to generate random email
function generateRandomEmail(name: string): string {
  const domains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'protonmail.com', 'aol.com', 'mail.com', 'zoho.com', 'fastmail.com'
  ];
  
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const username = name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 1000);
  
  return `${username}@${domain}`;
}

// Function to generate random location data
function generateRandomLocation(): { lat: number; lng: number; city: string; country: string } {
  const locations = [
    { lat: 40.7128, lng: -74.0060, city: "New York", country: "USA" },
    { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
    { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France" },
    { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "Japan" },
    { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia" },
    { lat: 37.7749, lng: -122.4194, city: "San Francisco", country: "USA" },
    { lat: 52.5200, lng: 13.4050, city: "Berlin", country: "Germany" },
    { lat: 55.7558, lng: 37.6176, city: "Moscow", country: "Russia" },
    { lat: -23.5505, lng: -46.6333, city: "São Paulo", country: "Brazil" },
    { lat: 28.6139, lng: 77.2090, city: "New Delhi", country: "India" },
    { lat: 39.9042, lng: 116.4074, city: "Beijing", country: "China" },
    { lat: -34.6037, lng: -58.3816, city: "Buenos Aires", country: "Argentina" },
    { lat: 31.2304, lng: 121.4737, city: "Shanghai", country: "China" },
    { lat: 25.2048, lng: 55.2708, city: "Dubai", country: "UAE" },
    { lat: 1.3521, lng: 103.8198, city: "Singapore", country: "Singapore" },
    { lat: 45.4642, lng: 9.1900, city: "Milan", country: "Italy" },
    { lat: 41.9028, lng: 12.4964, city: "Rome", country: "Italy" },
    { lat: 59.9311, lng: 30.3609, city: "St. Petersburg", country: "Russia" },
    { lat: 50.0755, lng: 14.4378, city: "Prague", country: "Czech Republic" },
    { lat: 47.4979, lng: 19.0402, city: "Budapest", country: "Hungary" },
    { lat: 52.3676, lng: 4.9041, city: "Amsterdam", country: "Netherlands" },
    { lat: 55.6761, lng: 12.5683, city: "Copenhagen", country: "Denmark" },
    { lat: 59.3293, lng: 18.0686, city: "Stockholm", country: "Sweden" },
    { lat: 60.1699, lng: 24.9384, city: "Helsinki", country: "Finland" },
    { lat: 64.1466, lng: -21.9426, city: "Reykjavik", country: "Iceland" },
    { lat: -37.8136, lng: 144.9631, city: "Melbourne", country: "Australia" },
    { lat: 43.6532, lng: -79.3832, city: "Toronto", country: "Canada" },
    { lat: 49.2827, lng: -123.1207, city: "Vancouver", country: "Canada" },
    { lat: 19.4326, lng: -99.1332, city: "Mexico City", country: "Mexico" },
    { lat: -22.9068, lng: -43.1729, city: "Rio de Janeiro", country: "Brazil" },
    { lat: 33.4484, lng: -112.0740, city: "Phoenix", country: "USA" },
    { lat: 29.7604, lng: -95.3698, city: "Houston", country: "USA" }
  ];
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  if (!location) {
    throw new Error('Failed to generate random location');
  }
  return location;
}

// Function to generate random browser data
function generateRandomBrowser(): string {
  const browsers = [
    "Chrome",
    "Firefox",
    "Safari",
    "Edge",
    "Opera",
    "Brave",
    "Internet Explorer",
    "Samsung Internet",
    "UC Browser",
    "Vivaldi"
  ];
  
  return browsers[Math.floor(Math.random() * browsers.length)] || "Chrome";
}

// Function to generate random date within the last 28 days
function generateRandomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 28) + 1; // 1 to 28 days ago
  const randomDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  
  // Add some random hours and minutes to make it more realistic
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  randomDate.setHours(randomHours, randomMinutes, 0, 0);
  
  return randomDate;
}

async function addDummySubmissions() {
  try {
    console.log(`Starting to add 10,000 dummy submissions to form: ${FORM_ID}`);
    
    // First, verify the form exists
    const form = await prisma.form.findUnique({
      where: { id: FORM_ID },
      select: {
        id: true,
        name: true,
        formType: true,
        schema: true
      }
    });
    
    if (!form) {
      console.error(`Form with ID ${FORM_ID} not found!`);
      return;
    }
    
    console.log(`Found form: ${form.name} (Type: ${form.formType})`);
    
    // Parse the form schema to understand the fields
    let formSchema: any = {};
    try {
      formSchema = JSON.parse(form.schema);
      console.log('Form schema fields:', Object.keys(formSchema));
    } catch (error) {
      console.error('Error parsing form schema:', error);
      return;
    }
    
    const submissions = [];
    const usedEmails = new Set<string>();
    
    // Generate 10,000 unique submissions
    for (let i = 0; i < 10000; i++) {
      let email: string;
      let name: string;
      
      // Ensure unique emails
      do {
        name = generateRandomName();
        email = generateRandomEmail(name);
      } while (usedEmails.has(email));
      
      usedEmails.add(email);
      
      // Create submission data based on form schema
      const submissionData: any = {
        email: email
      };
      
      // Add name field if it exists in the schema
      if (formSchema.name || formSchema.fullName || formSchema.full_name) {
        const nameField = formSchema.name ? 'name' : 
                         formSchema.fullName ? 'fullName' : 'full_name';
        submissionData[nameField] = name;
      }
      
      // Add any other fields that might exist in the schema
      Object.keys(formSchema).forEach(fieldKey => {
        if (fieldKey !== 'email' && fieldKey !== 'name' && fieldKey !== 'fullName' && fieldKey !== 'full_name') {
          const field = formSchema[fieldKey];
          
          // Generate dummy data based on field type
          switch (field.type) {
            case 'text':
            case 'textarea':
              submissionData[fieldKey] = `Sample ${field.label || fieldKey}`;
              break;
            case 'select':
              if (field.options && field.options.length > 0) {
                submissionData[fieldKey] = field.options[Math.floor(Math.random() * field.options.length)];
              }
              break;
            case 'checkbox':
              submissionData[fieldKey] = Math.random() > 0.5;
              break;
            case 'number':
              submissionData[fieldKey] = Math.floor(Math.random() * 100) + 1;
              break;
            default:
              submissionData[fieldKey] = `Sample ${fieldKey}`;
          }
        }
      });
      
      const randomDate = generateRandomDate();
      const location = generateRandomLocation();
      const browser = generateRandomBrowser();
      
      // Add location and browser data to submission data
      const submissionDataWithLocation = {
        ...submissionData,
        _meta: {
          location: {
            lat: location.lat,
            lng: location.lng,
            city: location.city,
            country: location.country
          },
          country: location.country,
          city: location.city,
          lat: location.lat,
          lng: location.lng,
          browser: browser
        }
      };
      
      submissions.push({
        id: undefined, // Let Prisma generate the ID
        data: submissionDataWithLocation,
        formId: FORM_ID,
        email: email,
        createdAt: randomDate,
        unsubscribed: false
      });
      
      if ((i + 1) % 500 === 0) {
        console.log(`Generated ${i + 1} submissions...`);
      }
    }
    
    console.log('\nInserting submissions into database...');
    
    // Insert submissions in batches to avoid overwhelming the database
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < submissions.length; i += batchSize) {
      const batch = submissions.slice(i, i + batchSize);
      
      try {
        await prisma.submission.createMany({
          data: batch,
          skipDuplicates: true // Skip if email already exists for this form
        });
        
        insertedCount += batch.length;
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(submissions.length / batchSize)} (${insertedCount} total)`);
      } catch (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        // Continue with next batch
      }
    }
    
    console.log(`\n✅ Successfully added ${insertedCount} dummy submissions to form ${FORM_ID}`);
    console.log(`🎯 Target: 10,000 submissions, Actual: ${insertedCount} submissions`);
    
    // Show some statistics
    const totalSubmissions = await prisma.submission.count({
      where: { formId: FORM_ID }
    });
    
    console.log(`📊 Total submissions for this form: ${totalSubmissions}`);
    
    // Show date range of submissions
    const oldestSubmission = await prisma.submission.findFirst({
      where: { formId: FORM_ID },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });
    
    const newestSubmission = await prisma.submission.findFirst({
      where: { formId: FORM_ID },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });
    
    if (oldestSubmission && newestSubmission) {
      console.log(`📅 Submission date range: ${oldestSubmission.createdAt.toLocaleDateString()} to ${newestSubmission.createdAt.toLocaleDateString()}`);
    }
    
  } catch (error) {
    console.error('Error adding dummy submissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addDummySubmissions();