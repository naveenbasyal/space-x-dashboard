import { Badge } from "@/components/ui/badge"
import type { LaunchStatus } from "@/types/spacex"

interface LaunchStatusBadgeProps {
  status: LaunchStatus
}

export function LaunchStatusBadge({ status }: LaunchStatusBadgeProps) {
  const getStatusConfig = (status: LaunchStatus) => {
    switch (status) {
      case "success":
        return {
          label: "Success",
          className: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-medium",
        }
      case "failed":
        return {
          label: "Failed",
          className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-medium",
        }
      case "upcoming":
        return {
          label: "Upcoming",
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 font-medium",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
