import { BASE_FETCH_LINK } from "@/constants";
import type { NameIdPair } from "@/types";
import { getIdFromUrl } from "@/utils";



export async function fetchNameIdPairs() {
  const response = await fetch(BASE_FETCH_LINK+"/?offset=0&limit=2000");
  const data = await response.json();

  const returnableList: NameIdPair[] = [];
  for (const item of data.results) {
    returnableList.push({name: item.name, id: Number(getIdFromUrl(item.url))});
  }

  return returnableList;
}


