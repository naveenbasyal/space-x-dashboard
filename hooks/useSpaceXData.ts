"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  SpaceXLaunch,
  SpaceXRocket,
  SpaceXLaunchpad,
  SpaceXPayload,
  EnrichedLaunch,
  DateFilter,
  LaunchFilter,
} from "@/types/spacex";

const SPACEX_API_BASE = "https://api.spacexdata.com/v4";

export function useSpaceXData() {
  const [launches, setLaunches] = useState<SpaceXLaunch[]>([]);
  const [rockets, setRockets] = useState<SpaceXRocket[]>([]);
  const [launchpads, setLaunchpads] = useState<SpaceXLaunchpad[]>([]);
  const [payloads, setPayloads] = useState<SpaceXPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [launchesRes, rocketsRes, launchpadsRes, payloadsRes] =
          await Promise.all([
            fetch(`${SPACEX_API_BASE}/launches`),
            fetch(`${SPACEX_API_BASE}/rockets`),
            fetch(`${SPACEX_API_BASE}/launchpads`),
            fetch(`${SPACEX_API_BASE}/payloads`),
          ]);

        if (
          !launchesRes.ok ||
          !rocketsRes.ok ||
          !launchpadsRes.ok ||
          !payloadsRes.ok
        ) {
          throw new Error("Failed to fetch SpaceX data");
        }

        const [launchesData, rocketsData, launchpadsData, payloadsData] =
          await Promise.all([
            launchesRes.json(),
            rocketsRes.json(),
            launchpadsRes.json(),
            payloadsRes.json(),
          ]);

        setLaunches(launchesData);
        setRockets(rocketsData);
        setLaunchpads(launchpadsData);
        setPayloads(payloadsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrichedLaunches = useMemo(() => {
    return launches.map((launch): EnrichedLaunch => {
      const rocketData = rockets.find((r) => r.id === launch.rocket);
      const launchpadData = launchpads.find((l) => l.id === launch.launchpad);
      const payloadData = payloads.filter((p) =>
        launch.payloads.includes(p.id)
      );

      let status: "success" | "failed" | "upcoming";
      if (launch.upcoming) {
        status = "upcoming";
      } else if (launch.success === true) {
        status = "success";
      } else {
        status = "failed";
      }

      return {
        ...launch,
        rocketData,
        launchpadData,
        payloadData,
        status,
      };
    });
  }, [launches, rockets, launchpads, payloads]);

  return {
    launches: enrichedLaunches,
    loading,
    error,
  };
}

export function useFilteredLaunches(
  launches: EnrichedLaunch[],
  dateFilter: DateFilter,
  launchFilter: LaunchFilter,
  customStartDate?: Date | null,
  customEndDate?: Date | null
) {
  return useMemo(() => {
    console.log("Filtering launches:", {
      totalLaunches: launches.length,
      dateFilter,
      launchFilter,
      customStartDate,
      customEndDate,
    });

    let filtered = [...launches];

    // Date filtering
    if (dateFilter !== "all") {
      if (dateFilter === "custom" && customStartDate && customEndDate) {
        console.log("Applying custom date filter:", {
          startDate: customStartDate.toISOString(),
          endDate: customEndDate.toISOString(),
        });

        const startTime = customStartDate.getTime();
        const endTime = customEndDate.getTime() + 24 * 60 * 60 * 1000;

        filtered = filtered.filter((launch) => {
          const launchTime = new Date(launch.date_utc).getTime();
          const isInRange = launchTime >= startTime && launchTime <= endTime;

          if (!isInRange && launch.flight_number <= 5) {
            console.log(
              `Launch ${launch.flight_number} (${launch.name}) excluded:`,
              {
                launchDate: launch.date_utc,
                launchTime,
                startTime,
                endTime,
                isInRange,
              }
            );
          }

          return isInRange;
        });

        console.log(`Custom filter result: ${filtered.length} launches`);
      } else {
        const now = new Date();
        const filterDate = new Date();

        switch (dateFilter) {
          case "week":
            filterDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            filterDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "3months":
            filterDate.setTime(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
            break;
          case "6months":
            filterDate.setTime(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
            break;
          case "year":
            filterDate.setTime(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          case "2years":
            filterDate.setTime(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
            break;
        }

        filtered = filtered.filter((launch) => {
          const launchDate = new Date(launch.date_utc);
          return launchDate >= filterDate;
        });
      }
    }

    switch (launchFilter) {
      case "upcoming":
        filtered = filtered.filter((launch) => launch.upcoming);
        break;
      case "successful":
        filtered = filtered.filter((launch) => launch.success === true);
        break;
      case "failed":
        filtered = filtered.filter((launch) => launch.success === false);
        break;
    }

    filtered.sort((a, b) => a.flight_number - b.flight_number);

    console.log(`Final filtered result: ${filtered.length} launches`);

    return filtered;
  }, [launches, dateFilter, launchFilter, customStartDate, customEndDate]);
}
