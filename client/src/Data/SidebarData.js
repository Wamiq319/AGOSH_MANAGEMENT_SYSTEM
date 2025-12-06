import {
  LayoutDashboard,
  Users,
  DollarSign,
  Building,
  Icon,
  ClipboardList,
} from "lucide-react";

export const SidebarMenus = {
  HEAD_OFFICE_ADMIN: [
    {
      label: "Dashboard",
      Icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Branches Management",
      Icon: Building,
      path: "/admin/branches",
    },
    {
      label: "Donors Management",
      Icon: Users,
      path: "/admin/donors",
    },
    {
      label: "Donations",
      Icon: DollarSign,
      path: "/admin/donations",
    },
    {
      label: "Students Management",
      Icon: Users,
      path: "/admin/students",
    },
    {
      label: "Need Reports Management",
      Icon: ClipboardList,
      path: "/admin/need-reports",
    },
  ],

  BRANCH_ADMIN: [
    {
      label: "Branch Dashboard",
      Icon: LayoutDashboard,
      path: "/branch-admin",
    },
    {
      label: "Students",
      Icon: Users,
      path: "/branch-admin/students",
    },
    {
      label: "Donations",
      Icon: DollarSign,
      path: "/branch-admin/donations",
    },
    {
      label: "Needs Reporting",
      Icon: ClipboardList,
      path: "/branch-admin/requests",
    },
  ],

  DONOR: [
    {
      label: "Donor Dashboard",
      Icon: LayoutDashboard,
      path: "/donor",
    },
    {
      label: "My Donations",
      Icon: DollarSign,
      path: "/donor/donations",
    },
  ],
};
