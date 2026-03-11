const messages = [
  {
    sender: "Developer A",
    message: "Can we extend the project deadline by 2 days?",
  },
  {
    sender: "Developer B",
    message: "I have submitted the updated backend API.",
  },
  {
    sender: "Developer C",
    message: "Facing an issue with deployment, please advise.",
  },
];

const CompanyMessages = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>

      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4"
          >
            <p className="font-medium">{msg.sender}</p>
            <p className="text-sm text-gray-600 mt-1">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyMessages;

