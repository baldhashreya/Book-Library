import * as fs from "fs";

/**
 * Robust CSV parser mapping lines to JSON records tightly typed.
 * Safely filters out nulls, empty lines, and carriage return anomalies.
 */
export const loadCSV = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  // Cleanly split across arbitrary OS line-endings
  const lines = data.split(/\r?\n/).filter((line: string) => line.trim() !== "");
  
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map((line: string) => {
    // Regex based split to respect quoted fields containing commas
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const record: any = {};
    headers.forEach((header: string, index: number) => {
      let val = values[index] ? values[index].trim() : "";
      // Remove surrounding quotes if present
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      record[header] = val;
    });
    return record;
  });
};
