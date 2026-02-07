import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="text-center text-3xl pt-10 text-gray-700 font-semibold">
        Contact Us
      </div>

      {/* Subtitle */}
      <p className="text-center text-gray-500 mt-2">
        We’re here to help! Reach out to our support team anytime.
      </p>

      {/* Main Section */}
      <div className="my-12 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm px-5 md:px-0">

        {/* Contact Image */}
        <img
          className="w-full md:max-w-[360px] rounded-xl shadow-sm"
          src={assets.contact_image}
          alt="Contact MediConnect"
        />

        {/* Contact Information */}
        <div className="flex flex-col items-start justify-center gap-7">

          {/* Email Support */}
          <div>
            <b className="text-gray-800 text-xl">📧 Email Support</b>
            <p className="text-gray-500 text-lg mt-1">
              Have questions or facing an issue?<br />
              Our team is always ready to help.<br />
              <span className="font-medium text-gray-700">
                support@mediconnect.com
              </span>
            </p>
          </div>

          {/* Phone Support */}
          <div>
            <b className="text-gray-800 text-xl">📞 Phone Assistance</b>
            <p className="text-gray-500 text-lg mt-1">
              Talk to our customer support team<br />
              (Mon–Sat, 10:00 AM – 6:00 PM)<br />
              <span className="font-medium text-gray-700">
                +91 98765 43210
              </span>
            </p>
          </div>

          {/* Office Address */}
          <div>
            <b className="text-gray-800 text-xl">📍 Office Address</b>
            <p className="text-gray-500 text-lg mt-1">
              MediConnect Health Technologies<br />
              Bengaluru, Karnataka, India
            </p>
          </div>

          {/* Careers Button */}
          <button className="border border-black px-8 py-4 text-sm rounded-md hover:bg-black hover:text-white transition-all duration-500">
            Explore Careers
          </button>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-2xl mx-auto bg-white shadow-md p-8 rounded-xl mb-20">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Send Us a Message
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Have any questions or suggestions? We'd love to hear from you.
        </p>

        <form className="flex flex-col gap-5">

          {/* Name Input */}
          <div>
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="text-gray-700 font-medium">Message</label>
            <textarea
              className="w-full p-3 mt-1 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>

        </form>
      </div>


      {/* Bottom Message */}
      <p className="text-center text-gray-500 pb-20">
        Our team will get back to you within <span className="font-medium">24–48 hours.</span>
      </p>
    </div>
  );
};

export default Contact;
