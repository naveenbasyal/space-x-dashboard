"use client";

import { useState } from "react";
import { useSpaceXData, useFilteredLaunches } from "@/hooks/useSpaceXData";
import { LaunchTable } from "@/components/LaunchTable";
import { FilterDropdowns } from "@/components/FilterDropdowns";
import type { DateFilter, LaunchFilter } from "@/types/spacex";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export default function SpaceXDashboard() {
  const { launches, loading, error } = useSpaceXData();
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [launchFilter, setLaunchFilter] = useState<LaunchFilter>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const filteredLaunches = useFilteredLaunches(
    launches,
    dateFilter,
    launchFilter,
    customStartDate,
    customEndDate
  );

  const handleCustomDateRange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load SpaceX data: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-8">
      {/* Header */}

      {/* SpaceX Logo */}
      <div className="flex items-center justify-center p-4 border-b shadow-sm">
        <Image
          src={"/logo.png"}
          width={100}
          height={100}
          alt="Space X Logo"
          quality={100}
          className="w-3/5 sm:w-2/6 md:w-2/8 lg:w-2/12 xl:w-1/16 object-cover"
        />
      </div>

      <div className="max-w-fit mx-auto space-y-8 ">
        {/* Filters */}
        <FilterDropdowns
          dateFilter={dateFilter}
          launchFilter={launchFilter}
          onDateFilterChange={setDateFilter}
          onLaunchFilterChange={setLaunchFilter}
          onCustomDateRange={handleCustomDateRange}
          launches={launches}
        />
        {/* Launch Table */}
        <div className="bg-white w-full ">
          <LaunchTable launches={filteredLaunches} loading={loading} />
        </div>
      </div>
    </div>
  );
}
