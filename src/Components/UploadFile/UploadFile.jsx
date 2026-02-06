import React, { useState, useEffect, useRef } from "react";
import pdfToText from "react-pdftotext";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Loader from "./Loader/Loader";
import "./UploadFile.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const UploadFile = () => {
  const uploadFileRef = useRef(null);

  useEffect(() => {
    const handleScrollToUploadSection = () => {
      uploadFileRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("scrollToUploadSection", handleScrollToUploadSection);
    return () =>
      window.removeEventListener(
        "scrollToUploadSection",
        handleScrollToUploadSection
      );
  }, []);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState(false);
  const [text, setText] = useState("");
  const [downloadText, setDownloadText] = useState("");

  const handleGemini = async () => {
    if (!text) {
      alert("Please upload a PDF first");
      return;
    }

    setLoading(true);
    setScreen(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s cold start buffer

      const res = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!res.ok || !data.summary) {
        throw new Error(data.error || "No summary returned");
      }

      const response = data.summary;

      let formatted = response
        .split("**")
        .map((part, i) => (i % 2 ? `<b>${part}</b>` : part))
        .join("")
        .replace(/\*/g, "</br>")
        .replace(/##/g, "=> ")
        .replace(/\s+/g, " ")
        .trim();

      setResult(formatted);

      setDownloadText(
        formatted
          .replace(/<\/?b>/g, "")
          .replace(/<\/br>/g, "\n")
      );
    } catch (error) {
      console.error("Backend error:", error);
      alert(
        error.name === "AbortError"
          ? "Server is waking up. Please click Submit again."
          : "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  };

  const pdfExtract = (e) => {
    const file = e.target.files[0];
    if (!file) return alert("File not selected!");

    pdfToText(file)
      .then((text) => setText(text))
      .catch(console.error);
  };

  const handleDownloadWord = async () => {
    const paragraphs = downloadText.split("\n").map(
      (line) => new Paragraph({ children: [new TextRun(line)] })
    );

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.docx";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div ref={uploadFileRef} className="main_container_bottom">
      {screen ? (
        <div className="upload_section_box">
          <div className="content_box">
            <h5><b>Here's your Summary -</b></h5>
            <br />
            <h4 dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        </div>
      ) : (
        <div className="upload_section_box">
          <i className="fa-solid fa-arrow-up-from-bracket box_icon"></i>
          <h3>Upload your file here</h3>
          <h2>(Drag & Drop)</h2>
          <input type="file" accept="application/pdf" onChange={pdfExtract} />
        </div>
      )}

      {loading && <Loader />}

      <div className="options_bottom">
        <button
          className="single_option"
          disabled={loading || !text}
          onClick={handleGemini}
        >
          <i className="fa-solid fa-check"></i>
          Submit
        </button>

        {screen && (
          <>
            <button
              className="single_option"
              disabled={loading}
              onClick={() => document.getElementById("file-input").click()}
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
              Upload Again
            </button>

            <input
              type="file"
              accept="application/pdf"
              id="file-input"
              hidden
              onChange={pdfExtract}
            />

            <button
              className="single_option"
              disabled={loading}
              onClick={handleDownloadWord}
            >
              <i className="fa-solid fa-down-long"></i>
              Download
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
