import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission (emailjs, backend endpoint, etc.)
    alert("Thank you for your message!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-800 pt-15 grid place-items-center text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-center mb-8">
          Have a question, suggestion, or just want to say hi? Fill out the form
          below and we'll get back to you soon!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6" id="contact_form">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
