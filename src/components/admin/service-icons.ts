import {
  Briefcase,
  Compass,
  Droplets,
  FileCheck,
  FlaskConical,
  Leaf,
  Map,
  Mountain,
  Search,
  Sprout,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { SERVICE_ICON_NAMES } from "@/lib/validations/services";

type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

/** Name → Lucide component for every icon the CMS allows (1:1 with the enum). */
const SERVICE_ICONS: Record<ServiceIconName, LucideIcon> = {
  Trees,
  Waves,
  Sprout,
  Search,
  FileCheck,
  Leaf,
  Map,
  Droplets,
  Mountain,
  FlaskConical,
  Compass,
  Briefcase,
};

/**
 * Resolve a stored icon name to a renderable component. Unknown names
 * degrade to a neutral leaf rather than crashing the admin console.
 */
export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name as ServiceIconName] ?? Leaf;
}
