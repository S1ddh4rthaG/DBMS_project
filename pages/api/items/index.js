// Return all items in the database & now semantic search is working

import dbConnect from "@/lib/connection";
import ProductItem from "@/models/ProductItem";

// require('dotenv').config()
// import { OpenAIApi } from "openai";
// import { Configuration } from "openai";
// import * as math from "mathjs";

// const configuration = new Configuration({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// //vector similarity
// const vectorSimularity = (a, b) => {
//   a = a.data[0].embedding
//   b = b.data[0].embedding
//   return math.dot(a, b) / (math.norm(a) * math.norm(b));
// };

// //create embedding
// const createEmbedding = async (text) => {
//   const response = await openai.createEmbedding({
//     model: "text-embedding-ada-002",
//     input: text,
//   });
//   return response.data;
// };

// const search = async (query) => {
//   const items = await ProductItem.find({}).populate("_id");
//   const queryEmbedding = await createEmbedding(query);
//   const results = items.map(async (item, index) => {
//     const itemEmbedding = await createEmbedding(
//       item.description
//     );
//     const similarity = vectorSimularity(queryEmbedding, itemEmbedding);
//     return { similarity, item: items[index] };
//   });

//   const threshold = 0.7;
//   //filter results
//   const filteredResults = (await Promise.all(results)).filter(
//     (result) => result.similarity > threshold
//   );

//   //sort the results
//   const sortedResults = (await Promise.all(filteredResults)).sort(
//     (a, b) => b.similarity - a.similarity
//   );

//   //get the original item object
//   const originalItems = sortedResults.map((result) => result.item._id);
//   return originalItems.slice(0, 5);
// };

export default async function handler(req, res) {
  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/items?query=: get items list");
      const { query } = req.query;

      const items = await ProductItem.find({}).populate("_id");
      if (!query) {
        return res.status(200).json({ success: true, items });
      }
      // const results = await search(query);
      // //item is object id
      // console.log(results);
      // const search_results = results.map((item) => {
      //   return items.find((i) => i._id.toString() === item.toString());
      // });
      // console.log(search_results);
      const search_results = items;
      res.status(200).json({ success: true, items: search_results });
      break;
  }
}
