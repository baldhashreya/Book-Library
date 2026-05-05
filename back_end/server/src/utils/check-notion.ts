import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function checkDatabase() {
  try {
    const response = await axios.get(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      }
    );
    console.log('Database Properties:');
    console.log(JSON.stringify(response.data.properties, null, 2));
  } catch (error: any) {
    console.error('Error fetching database:', error.response?.data || error.message);
  }
}

checkDatabase();
