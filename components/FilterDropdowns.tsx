"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  CalendarIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { DateFilter, LaunchFilter, EnrichedLaunch } from "@/types/spacex";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface FilterDropdownsProps {
  dateFilter: DateFilter;
  launchFilter: LaunchFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  onLaunchFilterChange: (filter: LaunchFilter) => void;
  onCustomDateRange: (startDate: Date | null, endDate: Date | null) => void;
  launches: EnrichedLaunch[];
}

const launchFilterOptions = [
  { value: "all" as LaunchFilter, label: "All Launches" },
  { value: "upcoming" as LaunchFilter, label: "Upcoming Launches" },
  { value: "successful" as LaunchFilter, label: "Successful Launches" },
  { value: "failed" as LaunchFilter, label: "Failed Launches" },
];

export function FilterDropdowns({
  dateFilter,
  launchFilter,
  onDateFilterChange,
  onLaunchFilterChange,
  onCustomDateRange,
  launches,
}: FilterDropdownsProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const [startMonth, setStartMonth] = useState(5);
  const [startYear, setStartYear] = useState(2006);
  const [endMonth, setEndMonth] = useState(6);
  const [endYear, setEndYear] = useState(2025);

  const dateFilterOptions = [
    { value: "all" as DateFilter, label: "All Time" },
    { value: "week" as DateFilter, label: "Past Week" },
    { value: "month" as DateFilter, label: "Past Month" },
    { value: "3months" as DateFilter, label: "Past 3 Months" },
    { value: "6months" as DateFilter, label: "Past 6 Months" },
    { value: "year" as DateFilter, label: "Past Year" },
    { value: "2years" as DateFilter, label: "Past 2 Years" },
    { value: "clear" as DateFilter, label: "Clear" },
  ];

  const currentDateLabel = useMemo(() => {
    if (dateFilter === "custom" && selectedStartDate && selectedEndDate) {
      return `${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()}`;
    }
    return (
      dateFilterOptions.find((option) => option.value === dateFilter)?.label ||
      "Select Timeframe"
    );
  }, [dateFilter, selectedStartDate, selectedEndDate]);

  const currentLaunchLabel =
    launchFilterOptions.find((option) => option.value === launchFilter)
      ?.label || "All Launches";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const yearOptions = Array.from(
    { length: new Date().getFullYear() + 5 - 2006 + 1 },
    (_, i) => 2006 + i
  );

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const handleDateClick = (
    day: number,
    month: number,
    year: number,
    isStartCalendar: boolean
  ) => {
    const clickedDate = new Date(year, month, day);

    if (isStartCalendar) {
      setSelectedStartDate(clickedDate);

      if (selectedEndDate && clickedDate > selectedEndDate) {
        setSelectedEndDate(null);
      }
    } else {
      if (selectedStartDate && clickedDate >= selectedStartDate) {
        setSelectedEndDate(clickedDate);
      }
    }
  };

  const handleFilterOptionClick = (value: DateFilter) => {
    if (value === "clear") {
      onDateFilterChange("all");
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onCustomDateRange(null, null);
      setCalendarOpen(false);
    } else if (value !== "custom") {
      onDateFilterChange(value);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onCustomDateRange(null, null);
      setCalendarOpen(false);
    }
  };

  const handleApplyCustomRange = () => {
    if (selectedStartDate && selectedEndDate) {
      console.log("Applying custom range:", {
        start: selectedStartDate,
        end: selectedEndDate,
        startISO: selectedStartDate.toISOString(),
        endISO: selectedEndDate.toISOString(),
      });

      onDateFilterChange("custom");
      onCustomDateRange(selectedStartDate, selectedEndDate);
      setCalendarOpen(false);
    }
  };

  const isDateInRange = (day: number, month: number, year: number) => {
    if (!selectedStartDate) return false;
    const date = new Date(year, month, day);

    if (selectedEndDate) {
      return date >= selectedStartDate && date <= selectedEndDate;
    } else {
      return date.getTime() === selectedStartDate.getTime();
    }
  };

  const isDateSelected = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    return (
      (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
      (selectedEndDate && date.getTime() === selectedEndDate.getTime())
    );
  };

  const navigateCalendars = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (startMonth === 0) {
        setStartMonth(11);
        setStartYear(startYear - 1);
      } else {
        setStartMonth(startMonth - 1);
      }

      if (endMonth === 0) {
        setEndMonth(11);
        setEndYear(endYear - 1);
      } else {
        setEndMonth(endMonth - 1);
      }
    } else {
      if (startMonth === 11) {
        setStartMonth(0);
        setStartYear(startYear + 1);
      } else {
        setStartMonth(startMonth + 1);
      }

      if (endMonth === 11) {
        setEndMonth(0);
        setEndYear(endYear + 1);
      } else {
        setEndMonth(endMonth + 1);
      }
    }
  };

  const renderCalendar = (
    month: number,
    year: number,
    isStartCalendar: boolean,
    onMonthChange: (month: number) => void,
    onYearChange: (year: number) => void
  ) => {
    const days = getDaysInMonth(month, year);

    return (
      <div className="w-full md:w-64 p-4">
        {/* Month/Year Selectors  */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="font-semibold text-gray-900 hover:bg-gray-100"
              >
                {monthNames[month]}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {monthNames.map((monthName, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onMonthChange(index)}
                >
                  {monthName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="font-semibold text-gray-900 hover:bg-gray-100"
              >
                {year}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-48 overflow-y-auto">
              {yearOptions.map((yearOption) => (
                <DropdownMenuItem
                  key={yearOption}
                  onClick={() => onYearChange(yearOption)}
                >
                  {yearOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Calendar  */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`text-center py-2 text-sm cursor-pointer h-8 flex items-center justify-center rounded transition-colors ${
                day
                  ? isDateSelected(day, month, year)
                    ? "bg-blue-500 text-white"
                    : isDateInRange(day, month, year)
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                  : ""
              }`}
              onClick={() =>
                day && handleDateClick(day, month, year, isStartCalendar)
              }
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between gap-6">
      {/* Date Filter Modal */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between min-w-[200px] sm:min-w-[200px] bg-white border-gray-300"
          >
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span className="truncate">{currentDateLabel}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-fit sm:max-w-fit p-0 bg-white max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg border">
            {/* Left Side */}
            <div className="w-full sm:w-48 border-r-0 sm:border-r border-b sm:border-b-0 border-gray-200 p-4">
              <DialogTitle></DialogTitle>
              <div className="space-y-1">
                {dateFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                      dateFilter === option.value
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                    onClick={() => handleFilterOptionClick(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right   Calendar */}
            <div className="bg-white w-full">
              {/* Calendar Navigation */}
              <div className="flex items-center px-4 py-3 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateCalendars("prev")}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateCalendars("next")}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Dual Calendar - START and END */}
              <div className="flex flex-col sm:flex-row overflow-x-auto">
                {/* START Calendar */}
                <div className="min-w-0 flex-shrink-0">
                  {renderCalendar(
                    startMonth,
                    startYear,
                    true,
                    setStartMonth,
                    setStartYear
                  )}
                </div>

                {/* END Calendar */}
                <div className="min-w-0 flex-shrink-0">
                  {renderCalendar(
                    endMonth,
                    endYear,
                    false,
                    setEndMonth,
                    setEndYear
                  )}
                </div>
              </div>

              {/* Apply Button */}
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <Button
                  onClick={handleApplyCustomRange}
                  disabled={!selectedStartDate || !selectedEndDate}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Launch Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between min-w-[160px] bg-white border-gray-300"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              {currentLaunchLabel}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px]">
          {launchFilterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onLaunchFilterChange(option.value)}
              className={launchFilter === option.value ? "bg-accent" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
