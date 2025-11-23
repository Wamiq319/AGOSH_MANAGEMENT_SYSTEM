import { LayoutDashboard, Users, DollarSign, Building } from "lucide-react";

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
      label: "Students Management",
      Icon: Users,
      path: "/admin/students",
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
      path: "/branch-admin/students", // you can add later when students page exists
    },
    {
      label: "Donations",
      Icon: DollarSign,
      path: "/branch-admin/donations", // optional future route
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
      path: "/donor/donations", // optional future route
    },
  ],
};
