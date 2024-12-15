import { NextResponse } from "next/server";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Unsplash Access Key not defined" },
      { status: 500 }
    );
  }

  try {
    const encodedQuery = encodeURIComponent(`${query} landscape`);
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: encodedQuery,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    const imageUrl = results[0]?.urls?.regular;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
