import { useState } from "react";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import "./CreatePost.css";

const mdParser = new MarkdownIt();

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterURL, setPosterURL] = useState("");
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState([]);

  const categories = [
    "Technology",
    "Health",
    "Travel",
    "Education",
    "Lifestyle",
    "Software",
    "Business",
    "Entertainment",
    "Food",
    "Finance",
    "Science",
    "Sports",
    "Gaming",
    "Art",
    "Fashion",
    "Photography",
    "Music",
    "Environment",
  ];

  // ✅ Upload to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xTensiver");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Handle image upload from markdown editor
  const handleEditorImageUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return Promise.reject("Image too large");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP allowed");
      return Promise.reject("Invalid file type");
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      return imageUrl;
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
      return Promise.reject("Upload failed");
    }
  };

  // ✅ Poster Upload
  const handlePosterChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    try {
      setIsUploadingPoster(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setPosterURL(imageUrl);
      toast.success("Poster uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload poster");
    } finally {
      setIsUploadingPoster(false);
    }
  };

  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !posterURL ||
      !markdownContent ||
      selectedTags.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        title,
        description,
        poster: posterURL,
        content: markdownContent,
        tags: selectedTags.map((tag) => tag.value),
      };

      const response = await fetch(`/api/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Failed to create post");
        return;
      }

      toast.success("Post published!");
      navigate(`/post/${data.slug}`);

      // Reset form
      setTitle("");
      setDescription("");
      setPosterURL("");
      setSelectedTags([]);
      setMarkdownContent("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl pt-24 mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen transition-all">
      <Link
        to={-1}
        className="bg-red-500 text-white cursor-pointer p-2 px-4 rounded-md"
      >
        Go Back
      </Link>

      <h1 className="text-3xl font-bold mb-8 mt-8 text-gray-900 dark:text-gray-100">
        Create New Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
          >
            Post Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-400 text-gray-800 dark:text-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-"
          >
            Short Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-18 p-3 border border-gray-400 text-gray-800 dark:text-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600 min-h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Enter short description..."
            required
          />
        </div>

        {/* Category Selector */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Select Category
          </label>
          <CreatableSelect
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused
                  ? "var(--hover-color)"
                  : "var(--bg-color)",
                color: "var(--text-color)",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "var(--tag-bg-color)",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "var(--tag-text-color)",
              }),
              input: (base) => ({
                ...base,
                color: "var(--text-color)",
              }),
              singleValue: (base) => ({
                ...base,
                color: "var(--text-color)",
              }),
            }}
            isMulti
            placeholder="Add tags"
            value={selectedTags}
            onChange={(value) => setSelectedTags(value)}
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            className="react-select-container border-1 border-gray-400 rounded-[6px]"
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#6366f1",
                primary25: "#4f46e5",
                neutral0: "var(--bg-color)",
                neutral80: "var(--text-color)",
              },
            })}
          />
        </div>

        {/* Poster Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Poster
          </label>
          <div className="flex items-center gap-2">
            <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isUploadingPoster ? "Uploading..." : "Choose a file"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="hidden"
                disabled={isUploadingPoster}
              />
            </label>
            {isUploadingPoster ? (
              <BeatLoader size={8} color="#6366f1" />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {posterURL ? "File selected" : "No file chosen"}
              </span>
            )}
          </div>
          {posterURL && (
            <div className="mt-4">
              <img
                src={posterURL}
                alt="Poster preview"
                className="max-h-64 w-auto object-cover rounded-md border dark:border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Markdown Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Content (Markdown supported)
          </label>
          <div className="border border-gray-400 dark:border-gray-600 rounded-md overflow-hidden">
            <MdEditor
              style={{ height: "500px" }}
              value={markdownContent}
              onChange={({ text }) => setMarkdownContent(text)}
              onImageUpload={handleEditorImageUpload}
              renderHTML={(text) => mdParser.render(text)}
              className="dark:bg-gray-700 dark:text-white"
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: false,
                },
                imageUrl: "https://octodev.me/api/v3/upload",
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex mt-24 justify-end">
          <button
            type="submit"
            className="bg-indigo-600 cursor-pointer text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center min-w-32"
            disabled={isSubmitting || isUploadingPoster}
          >
            {isSubmitting ? (
              <BeatLoader size={8} color="#ffffff" />
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
