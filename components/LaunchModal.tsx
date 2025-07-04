"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { EnrichedLaunch } from "@/types/spacex";
import { LaunchStatusBadge } from "./LaunchStatusBadge";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

interface LaunchModalProps {
  launch: EnrichedLaunch | null;
  open: boolean;
  onClose: () => void;
}

export function LaunchModal({ launch, open, onClose }: LaunchModalProps) {
  if (!launch) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("launch", launch);
  const primaryPayload = launch.payloadData?.[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" p-0 gap-0 w-11/12 rounded-md">
        {/* Header  */}
        <div className="relative p-6 pb-4">
          {/* Close Button
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 z-10"
          >
            <X className="h-5 w-5" />
          </Button> */}

          {/* Mission Patch and Title */}
          <div className="flex items-start space-x-6">
            {/* Mission Patch */}
            <div className="flex-shrink-0">
              {launch.links.patch.large ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={launch.links.patch.large || "/placeholder.svg"}
                    alt={`${launch.name} mission patch`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Patch</span>
                </div>
              )}
            </div>

            {/* Mission Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 ">
                <DialogTitle asChild>
                  <h2 className="text-2xl text-gray-900">{launch.name}</h2>
                </DialogTitle>

                <LaunchStatusBadge status={launch.status} />
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {launch.rocketData?.name || "Unknown Rocket"}
              </p>

              {/* External Links */}
              <div className="flex items-center space-x-2">
                {/* NASA Link */}
                {launch.links.article && (
                  <a
                    href={launch.links.article}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Image
                      src={"/nasa.png"}
                      width={20}
                      height={20}
                      alt="Nasa image"
                      unoptimized
                      quality={100}
                      priority
                      className="object-contain"
                    />
                  </a>
                )}

                {/* Wikipedia Link */}
                {launch.links.article && (
                  <a
                    href={launch.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Image
                      src={"/wiki.png"}
                      width={20}
                      height={20}
                      alt="Wiki image"
                      unoptimized
                      quality={100}
                      priority
                      className="object-contain"
                    />
                  </a>
                )}

                {/* YouTube Link */}
                {launch.links.webcast && (
                  <a
                    href={launch.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Image
                      src={"/youtube.png"}
                      width={20}
                      height={20}
                      alt="Youtube image"
                      unoptimized
                      quality={100}
                      priority
                      className="object-contain"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description  */}
        {launch.details && (
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-sm text-gray-700 leading-relaxed">
              {launch.details}
              <a href={launch.links.wikipedia} className="text-blue-600">
                {" "}
                Wikipedia
              </a>
            </p>
          </div>
        )}

        {/* Extra DEtail */}
        <div className="px-6 pt-4">
          <dl className="divide-y divide-gray-200">
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Flight Number
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                #{launch.flight_number}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Mission Name
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.name}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Rocket Type
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.rocketData?.type || "Unknown"}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Rocket Name
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.rocketData?.name || "Unknown"}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Manufacturer
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.rocketData?.company || "SpaceX"}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Nationality
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.rocketData?.country || "USA"}
              </dd>
            </div>
            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Launch Date
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {formatDate(launch.date_utc)}
              </dd>
            </div>

            {primaryPayload && (
              <>
                <div className="grid grid-cols-3 items-center justify-between py-3">
                  <dt className="text-sm col-span-1 font-medium text-gray-500">
                    Payload Type
                  </dt>
                  <dd className="text-sm col-span-2 text-gray-900">
                    {primaryPayload.type}
                  </dd>
                </div>
                <div className="grid grid-cols-3 items-center justify-between py-3">
                  <dt className="text-sm ol-span-1 font-medium text-gray-500">
                    Orbit
                  </dt>
                  <dd className="text-sm col-span-2 text-gray-900">
                    {primaryPayload.orbit}
                  </dd>
                </div>
              </>
            )}

            <div className=" items-center grid grid-cols-3 py-3">
              <dt className="text-sm col-span-1 font-medium text-gray-500">
                Launch Site
              </dt>
              <dd className="text-sm col-span-2 text-gray-900">
                {launch.launchpadData?.name || "Unknown"}
              </dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
