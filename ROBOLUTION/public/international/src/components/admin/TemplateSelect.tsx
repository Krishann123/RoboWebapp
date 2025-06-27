import React from "react";

interface TemplateSelectProps {
  templateData: string[];
  selectedIndex: number;
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({ templateData, selectedIndex }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    console.log("Changed index!", idx);

    // Call your API route to update the selected index
    await fetch("/api/update-selected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIndex: idx }),
    });
  };

  return (
    <div className="inline-block relative w-64">
      <select
        id="myComboBox"
        className="w-full px-10 py-2 rounded-lg border border-violet-300 shadow-md bg-gradient-to-r from-violet-100 to-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition duration-200 appearance-none cursor-pointer"
        value={selectedIndex}
        onChange={handleChange}
      >
        {templateData.map((page, idx) => (
          <option
            value={idx}
            key={page}
            className="bg-white text-violet-800 hover:bg-violet-100 transition-colors"
          >
            {page}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
};

export default TemplateSelect;