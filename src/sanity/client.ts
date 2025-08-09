// src/sanity/client.ts

import { createClient } from "next-sanity";

// These are your project details from the .env.local file
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = "2023-05-03"; // Use a UTC date in YYYY-MM-DD format

// This is the client that your pages will use to talk to Sanity
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to true for production for faster reads
});