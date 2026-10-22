
"use client";

import React, { useState } from "react";
import styles from "../../components/styles/url.module.css";
import { GeneraterandomstringSERVICE } from "@/services/services";

const GeneraterandomstringPage = () => {
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    url: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setComplete(false);
    setData(null);

    const longurlObj = {
      longurl: formData.url.trim()
    };

    const APIURL =
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}url-sortner`;

    console.log("API URL:", APIURL);
    console.log("Request body:", longurlObj);

    try {
      const response = await GeneraterandomstringSERVICE(
        APIURL,
        longurlObj
      );

      console.log("API response:", response);

      // Support either a direct response or Axios response
      const result = response?.data ?? response;

      if (!result?.shortlink) {
        throw new Error("Short link is missing from the API response");
      }

      setData(result);
      setComplete(true);
    } catch (err) {
      console.error("URL generation failed:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate short URL"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.GeneratePageSection}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputDiv}>
          <label htmlFor="url">Enter your URL here:</label>

          <input
            type="url"
            name="url"
            id="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Short Link →"}
        </button>

        {error && <p role="alert">{error}</p>}

        {complete && data && (
          <div>
            <p>Your new short URL is:</p>

            <a
              href={data.shortlink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.shortlink}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneraterandomstringPage;
