import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Ananya",
    text: "MediConnect helped me book appointments so easily. The AI assistant is super helpful!"
  },
  {
    name: "Rohit",
    text: "The ability to store all my reports in one place is amazing. Doctors love it too!"
  },
  {
    name: "Priya",
    text: "This is the future of healthcare. Smooth, fast & secure."
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center border transition-all duration-500">
        <p className="text-gray-700 italic text-lg">“{testimonials[index].text}”</p>
        <h3 className="mt-4 font-bold">{testimonials[index].name}</h3>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === i ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
