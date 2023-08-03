import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Allow dynamic port assignment (for deployment)

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Static list of Canadian locations for the dropdowns
const canadianLocations = [
  'Toronto, ON',
  'Vancouver, BC',
  'Montreal, QC',
  'Calgary, AB',
  'Ottawa, ON',
  'Edmonton, AB',
  // Add more Canadian locations as needed
];

const viewsPath = path.join(__dirname, 'views'); // Create the path to the 'views' folder

app.set('view engine', 'ejs');
app.set('views', viewsPath); // Set the views directory

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.render('index', { locations: canadianLocations });
});

app.get('/distance', async (req: Request, res: Response) => {
  const { origin, destination } = req.query;
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;

    // Extract the distance and duration from the API response
    const distanceText = data.rows[0].elements[0].distance.text;
    const durationText = data.rows[0].elements[0].duration.text;

    // Send the calculated distance and duration as a JSON response
    res.json({ distance: distanceText, duration: durationText });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
