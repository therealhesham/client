//@ts-nocheck
//@ts-ignore
import Airtable, { Table } from "airtable";
import { NextResponse } from "next/server";

var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

  try {
    const { id } = await params;
    const result = await new Promise<any[]>((resolve, reject) => {
      const results = base("السير الذاتية")
        .select({
          fields: ["fld1k07dcF6YGJK2Z", "fldKKxbf5nHUYaBuw","fldCGgsI6zKftx1ZF"],
          filterByFormula: `And(REGEX_MATCH({fld1k07dcF6YGJK2Z},"${id}"))`,
          view: "الاساسي",
        })
        .all();

      resolve(results);
    });

    // console.log(/);
    // Send the filtered and paginated data as the response
    return NextResponse.json(
      { result:result },
      { status: 200 }
    );



  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      { error: "Error fetching data" },
      { status: 500 }
    );

  }
}
