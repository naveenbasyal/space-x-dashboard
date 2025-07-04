export interface SpaceXLaunch {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  date_local: string;
  upcoming: boolean;
  success: boolean | null;
  failures: Array<{
    time: number;
    altitude?: number;
    reason: string;
  }>;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    wikipedia: string;
    webcast: string | null;
    article: string | null;
  };
  rocket: string;
  launchpad: string;
  payloads: string[];
  cores: Array<{
    core: string | null;
    flight: number | null;
    gridfins: boolean | null;
    legs: boolean | null;
    reused: boolean | null;
    landing_attempt: boolean | null;
    landing_success: boolean | null;
    landing_type: string | null;
    landpad: string | null;
  }>;
}

export interface SpaceXRocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: {
    meters: number;
    feet: number;
  };
  diameter: {
    meters: number;
    feet: number;
  };
  mass: {
    kg: number;
    lb: number;
  };
  engines: {
    number: number;
    type: string;
    version: string;
    layout: string;
  };
}

export interface SpaceXLaunchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  status: string;
}

export interface SpaceXPayload {
  id: string;
  name: string;
  type: string;
  reused: boolean;
  launch: string;
  customers: string[];
  norad_ids: number[];
  nationalities: string[];
  manufacturers: string[];
  mass_kg: number | null;
  mass_lbs: number | null;
  orbit: string;
  reference_system: string;
  regime: string;
  longitude: number | null;
  semi_major_axis_km: number | null;
  eccentricity: number | null;
  periapsis_km: number | null;
  apoapsis_km: number | null;
  inclination_deg: number | null;
  period_min: number | null;
  lifespan_years: number | null;
  epoch: string | null;
}

export type LaunchStatus = "success" | "failed" | "upcoming";
export type DateFilter =
  | "week"
  | "month"
  | "3months"
  | "6months"
  | "year"
  | "2years"
  | "5years"
  | "10years"
  | "15years"
  | "all"
  | "custom"
  | "clear";
export type LaunchFilter = "all" | "upcoming" | "successful" | "failed";

export interface EnrichedLaunch extends SpaceXLaunch {
  rocketData?: SpaceXRocket;
  launchpadData?: SpaceXLaunchpad;
  payloadData?: SpaceXPayload[];
  status: LaunchStatus;
}
