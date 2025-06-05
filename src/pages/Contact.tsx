import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";
import PageHero from "@/components/PageHero";
import axios from "axios";
import { toast } from "sonner";
import nodemailer from "nodemailer"; // Ensure you have nodemailer installed
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: true, // Enable debug mode
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: `${formData.email}, wandertribe@outlook.com`, // Replace with your marketing team's email
        subject: "New Contact Form Submission",
        html: formData.message,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error:", error);
      console.log(
        "Failed to send email. Please check your SMTP configuration and ensure the environment variables are set correctly."
      );
      toast.error("Failed to send email. Please try again later.", {
        position: "bottom-right",
      });
    }

    try {
      const res = await fetch(
        "https://echoedtech.vercel.app/api/contact/sendMail2  ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", res.status);

      // Parse the response
      const responseData = await res.json();
      console.log("Response data:", responseData);

      if (res.ok) {
        toast.success(`Mail sent successfully!`, {
          position: "bottom-right",
        });

        // Reset form data on success
        setFormData({
          email: "",
          message: "",
          name: "",
          subject: "",
          phone: "",
        });
      } else {
        // Handle API errors
        toast.error(`Error: ${responseData.error || "Failed to send mail"}`, {
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      console.log("Network or parsing error:", error.message);
      toast.error(`Network error: ${error.message}`, {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Contact US"
        description="Have questions or ready to book your next adventure? Get in touch with our travel experts.
              We're here to help you plan the journey of a lifetime.
"
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
      />
      <div className="py-16">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-travel-earth"></h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto"></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
            <div className="lg:col-span-2 bg-travel-cloud-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-travel-earth">
                Get In Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-travel-teal/10 p-3 rounded-full mr-4">
                    <MapPin size={24} className="text-travel-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Our Location</h3>
                    <p className="text-gray-600">
                      Rosa Elite 1st Floor
                      <br />
                      Thane West 400615
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-travel-teal/10 p-3 rounded-full mr-4">
                    <Mail size={24} className="text-travel-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">info@wandertribe.co.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-travel-teal/10 p-3 rounded-full mr-4">
                    <Phone size={24} className="text-travel-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">+91 9326412687</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-travel-teal/10 p-3 rounded-full mr-4">
                    <MessageSquare size={24} className="text-travel-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday-Friday: 9:00 AM - 6:00 PM PST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM PST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-travel-cloud-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-travel-earth">
                Send a Message
              </h2>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p>
                    Your message has been sent successfully. One of our travel
                    experts will be in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travel-teal"
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="email">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travel-teal"
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travel-teal"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="subject">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travel-teal"
                        required>
                        <option value="">Select a subject</option>
                        <option value="Trip Inquiry">Trip Inquiry</option>
                        <option value="Booking Question">
                          Booking Question
                        </option>
                        <option value="Custom Itinerary">
                          Custom Itinerary
                        </option>
                        <option value="General Question">
                          General Question
                        </option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="message">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-travel-teal"
                      required></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-travel-teal hover:bg-travel-earth text-travel-cloud-white font-medium py-3 px-6 rounded-md transition-colors w-full">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="bg-travel-cloud-white rounded-lg shadow-md overflow-hidden h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7531.787612610198!2d72.94541208623305!3d19.286983737784173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bb0324914c3f%3A0xb21bc2c2e8a8363c!2sRosa%20Elite%20A%20CHSL!5e0!3m2!1sen!2sin!4v1745953734660!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
