import {
  Users,
  FileText,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  UserMinus,
} from "lucide-react";

export const SidebarMenus = {
  ADMIN: [
    {
      label: "Admin Dashboard",
      Icon: LayoutDashboard,
      path: "/admin/",
    },
    {
      label: "Scholarship Management",
      Icon: FileText, 
      path: "/admin/scholarships",
    },
    {
      label: "Student Management",
      Icon: Users, // Students
      path: "/admin/students",
    },
    {
      label: "Committee Management",
      Icon: UserMinus,
      path: "/admin/committee",
    },
    {
      label: "Application Management",
      Icon: FileText, // Applications
      path: "/admin/applicationmanagement",
    },
  ],
  STUDENT: [
    {
      label: "Student Dashboard",
      Icon: LayoutDashboard,
      path: "/student",
    },
    {
      label: "Available Scholarships",
      Icon: FileText,
      path: "/student/scholarships",
    },
    {
      label: "My Applications",
      Icon: ClipboardList,
      path: "/student/applications",
    },
    {
      label: "Profile",
      Icon: Users,
      path: "/student/profile",
    },
  ],
  COMMITTEE: [
    {
      label: "Committee Dashboard",
      Icon: LayoutDashboard,
      path: "/committee/",
    },
    {
      label: "Assigned Applications",
      Icon: ClipboardList,
      path: "/committee/assigned",
    },
    {
      label: "Evaluated Applications",
      Icon: FileCheck,
      path: "/committee/evaluated",
    },
  ],
};
