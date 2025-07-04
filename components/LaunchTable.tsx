"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EnrichedLaunch } from "@/types/spacex";
import { LaunchStatusBadge } from "./LaunchStatusBadge";
import { LaunchModal } from "./LaunchModal";
import { Skeleton } from "@/components/ui/skeleton";

interface LaunchTableProps {
  launches: EnrichedLaunch[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 12;

export function LaunchTable({ launches, loading }: LaunchTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLaunch, setSelectedLaunch] = useState<EnrichedLaunch | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const totalPages = Math.ceil(launches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLaunches = launches.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRowClick = (launch: EnrichedLaunch) => {
    setSelectedLaunch(launch);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-[#F4F5F7] border-gray-200">
              <TableHead className="text-gray-600 font-medium py-4">
                No.
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Launched (UTC)
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Location
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Mission
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Orbit
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Launch Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Rocket
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <TableRow key={index} className="border-b border-gray-100">
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (launches.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">
          No launches found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="shadow-md border rounded-xl overflow-hidden">
        <div
          className="overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <Table className="min-w-full">
              <TableHeader className="rounded-t-xl">
                <TableRow className="border-b bg-[#F4F5F7] border-gray-200">
                  <TableHead className="text-gray-600 font-medium py-4 w-16 min-w-[60px]">
                    No.
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 w-48 min-w-[180px]">
                    Launched (UTC)
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 w-40 min-w-[120px] hidden sm:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 min-w-[200px]">
                    Mission
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 w-24 min-w-[80px] hidden md:table-cell">
                    Orbit
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 w-32 min-w-[120px]">
                    Launch Status
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium py-4 w-32 min-w-[100px] hidden lg:table-cell">
                    Rocket
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLaunches.map((launch) => (
                  <TableRow
                    key={launch.id}
                    className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleRowClick(launch)}
                  >
                    <TableCell className="py-4 text-gray-900 font-medium">
                      {launch.flight_number.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="py-4 text-gray-700">
                      <div className="min-w-0">
                        <div className="truncate">
                          {formatDate(launch.date_utc)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 sm:hidden">
                          {launch.launchpadData?.name || "Unknown"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-gray-700 hidden sm:table-cell">
                      {launch.launchpadData?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="py-4 text-gray-900 font-medium">
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {launch.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 md:hidden">
                          {launch.payloadData?.[0]?.orbit || "N/A"}
                          {launch.rocketData?.name && (
                            <span className="lg:hidden ml-2">
                              • {launch.rocketData.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-gray-700 hidden md:table-cell">
                      {launch.payloadData?.[0]?.orbit || "N/A"}
                    </TableCell>
                    <TableCell className="py-4">
                      <LaunchStatusBadge status={launch.status} />
                    </TableCell>
                    <TableCell className="py-4 text-gray-700 hidden lg:table-cell">
                      {launch.rocketData?.name || "Unknown"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end  py-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-600 border-l rounded-r-none rounded-l-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getVisiblePages().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={
                page === currentPage
                  ? "bg-[#005288] border rounded-none hover:bg-[#004070] text-white"
                  : "text-gray-600 border rounded-none hover:text-gray-900"
              }
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-600 border rounded-l-none rounded-r-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <LaunchModal
        launch={selectedLaunch}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
