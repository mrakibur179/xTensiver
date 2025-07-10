import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterURL, setPosterURL] = useState("");
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isUploadingEditorImage, setIsUploadingEditorImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const categories = [
    "Technology",
    "Health",
    "Travel",
    "Education",
    "Lifestyle",
  ];

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    placeholder: "Write your blog content here...",
    theme: "snow",
  });

  // ✅ Inject image handler after Quill is ready
  useEffect(() => {
    if (!quill) return;

    const handleImageUpload = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image must be less than 2MB");
          return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPG, PNG, or WEBP allowed");
          return;
        }

        try {
          setIsUploadingEditorImage(true);
          const range = quill.getSelection(true);

          // Insert placeholder
          const placeholder =
            "https://via.placeholder.com/150?text=Uploading...";
          quill.insertEmbed(range.index, "image", placeholder);
          quill.setSelection(range.index + 1);

          // Upload to Cloudinary
          const imageUrl = await uploadImageToCloudinary(file);

          // Replace placeholder
          quill.deleteText(range.index, 1);
          quill.insertEmbed(range.index, "image", imageUrl);
          quill.setSelection(range.index + 1);
        } catch (err) {
          toast.error("Upload failed");
          console.error(err);
        } finally {
          setIsUploadingEditorImage(false);
        }
      };
    };

    const toolbar = quill.getModule("toolbar");
    toolbar.addHandler("image", handleImageUpload);
  }, [quill]);

  // ✅ Upload to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xTensiver");

    // console.log("FormData entries:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

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

  // 🌙 Dark Mode Styling
  useEffect(() => {
    if (!quill) return;

    const editor = quill.root;

    const applyTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      editor.style.backgroundColor = isDark ? "#1f2937" : "#ffffff";
      editor.style.color = isDark ? "#f3f4f6" : "#111827";
      editor.style.borderColor = isDark ? "#4b5563" : "#d1d5db";
    };

    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [quill]);

  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quill) return;

    const content = quill.root.innerHTML;

    if (!title || !description || !posterURL || !content || !category) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        title,
        description,
        poster: posterURL,
        content,
        category,
      };

      const response = await fetch(`/api/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${access_token}`,
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error(data.message || "Failed to create post");
      }

      toast.success("Post published!");
      navigate(`/post/${data.slug}`);

      // Reset form
      setTitle("");
      setDescription("");
      setPosterURL("");
      setCategory("");
      quill.root.innerHTML = "";
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
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-400 text-gray-800 dark:text-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="">-- Choose a category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Content
          </label>
          <div className="h-96 bg-white dark:bg-gray-400 rounded-md dark:border-gray-600">
            <div
              ref={quillRef}
              className="h-full rounded-md dark:bg-gray-700 dark:text-white"
            />
            {isUploadingEditorImage && (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <BeatLoader size={8} color="#6366f1" />
                <span>Uploading image...</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex mt-24 justify-end">
          <button
            type="submit"
            className="bg-indigo-600 cursor-pointer text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center min-w-32"
            disabled={
              isSubmitting || isUploadingPoster || isUploadingEditorImage
            }
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
