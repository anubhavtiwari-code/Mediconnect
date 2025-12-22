export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Create Your Account",
            desc: "Quickly sign up and access your secure MediConnect dashboard.",
            icon: "👤",
        },
        {
            id: 2,
            title: "Upload Medical Reports",
            desc: "Store prescriptions, lab tests, and scans safely in one place.",
            icon: "📄",
        },
        {
            id: 3,
            title: "Book Doctors & Use AI Assistant",
            desc: "Find doctors, book appointments, and get AI-powered report insights.",
            icon: "🤖",
        },
    ];

    return (
        <div className="py-16 bg-gray-50 px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                How MediConnect Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition-all"
                    >
                        <div className="text-5xl mb-4">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                        <p className="text-gray-600 mt-2">{step.desc}</p>
                        <p className="text-blue-600 font-bold text-xl mt-4">
                            {step.id.toString().padStart(2, "0")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}