import axios from "axios";

export const GeneraterandomstringSERVICE = async (APIURL, longurl) => {
  try {
    const response = await axios.post(APIURL, longurl);
    return response;
  } catch (err) {
    console.log("Error during API request:", err.response?.data || err.message);
    throw err;
  }
};