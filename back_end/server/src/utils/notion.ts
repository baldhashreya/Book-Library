import axios from 'axios';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * Finds a log entry for a specific date
 * @param dateStr Format: YYYY-MM-DD
 * @returns The page ID if found, otherwise null
 */
export const findLogByDate = async (dateStr: string) => {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return null;

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        filter: {
          property: 'Name',
          title: {
            equals: `Daily Log: ${dateStr}`,
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      }
    );

    return response.data.results.length > 0 ? response.data.results[0].id : null;
  } catch (error: any) {
    logger.error('[Notion] Failed to query database', {
      error: error.response?.data || error.message,
    });
    return null;
  }
};

/**
 * Creates or retrieves a daily log entry in Notion
 * @returns The page ID of the log entry
 */
export const getOrCreateDailyLog = async () => {
  const today = new Date().toISOString().split('T')[0];
  const existingPageId = await findLogByDate(today);

  if (existingPageId) {
    // If it exists, just update status to In progress
    await updateNotionLog(existingPageId, 'In progress');
    return existingPageId;
  }

  // Otherwise, create a new one
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: {
            title: [{ text: { content: `Daily Log: ${today}` } }],
          },
          Status: {
            status: { name: 'In progress' },
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      }
    );
    return response.data.id;
  } catch (error: any) {
    logger.error('[Notion] Failed to create daily log', {
      error: error.response?.data || error.message,
    });
    return null;
  }
};

/**
 * Updates an existing Notion log entry status and adds content to the page body
 */
export const updateNotionLog = async (pageId: string, status: string = 'Done', content?: string) => {
  if (!NOTION_API_KEY || !pageId) return;

  try {
    // 1. Update status
    await axios.patch(
      `https://api.notion.com/v1/pages/${pageId}`,
      {
        properties: {
          Status: {
            status: { name: status },
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      }
    );

    // 2. Append content if provided
    if (content) {
      await axios.patch(
        `https://api.notion.com/v1/blocks/${pageId}/children`,
        {
          children: [
            {
              object: 'block',
              type: 'heading_3',
              heading_3: {
                rich_text: [{ text: { content: `Run at ${new Date().toLocaleTimeString()}` } }],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [{ text: { content } }],
              },
            },
            {
              object: 'block',
              type: 'divider',
              divider: {},
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
        }
      );
    }
  } catch (error: any) {
    logger.error('[Notion] Update failed', { error: error.response?.data || error.message });
  }
};
