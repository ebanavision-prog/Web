import { Camera, Video, PenTool, Printer, Target, Award, type LucideIcon } from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  camera: Camera,
  video: Video,
  "pen-tool": PenTool,
  printer: Printer,
  target: Target,
  award: Award,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Camera;
}
