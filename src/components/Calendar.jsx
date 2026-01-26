import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { es } from "date-fns/locale";


function Calendar({ onSelectDates }) {
  const [selectedDays, setSelectedDays] = useState([]);

  function handleSelect(days) {
    if (!days) {
      setSelectedDays([]);
      onSelectDates([]);
      return;
    }

    const ordenadas = [...days].sort(
      (a, b) => a.getTime() - b.getTime()
    );

    setSelectedDays(ordenadas);
    onSelectDates(ordenadas);
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <DayPicker
        mode="multiple"
        selected={selectedDays}
        onSelect={handleSelect}
        disabled={{ before: new Date() }}
        locale={es}
        classNames={{
          caption: "flex justify-between items-center mb-4",
          caption_label: "text-lg font-semibold capitalize",
          nav_button:
            "h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center",
          head_cell:
            "text-sm font-medium text-gray-500",
          day: `
            rounded-full
            hover:bg-green-100
            transition
          `,
          day_selected:
            "bg-red-600 text-white hover:bg-red-700",
          day_today:
            "border border-red-500 font-semibold",
          day_disabled: "text-gray-300",
        }}
      />
    </div>
  );
}

export default Calendar;