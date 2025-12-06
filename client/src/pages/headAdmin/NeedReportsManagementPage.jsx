import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResources,
  updateResource,
  deleteResource,
} from "@/redux/slices/resourcesSLice";

import {
  DataTable,
  ConfirmationModal,
  Modal,
  Button,
  Toast,
} from "@/components";

import {
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBuilding,
  FaBullhorn, // Icon rehne diya, page title ke liye
} from "react-icons/fa";

export const NeedReportsManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isToastOpen, setToast] = useState(null);

  const allNeeds = data.needs || [];

  // Data fetch: Saari needs reports
  useEffect(() => {
    dispatch(fetchResources({ resource: "needs" }));
  }, [dispatch]);

  // --- Helper Functions ---

  const getStatusDisplay = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="text-green-600 font-medium flex items-center gap-1">
            <FaCheckCircle /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-red-500 font-medium flex items-center gap-1">
            <FaTimesCircle /> Rejected
          </span>
        );
      case "FULFILLED":
        return (
          <span className="text-blue-600 font-medium flex items-center gap-1">
            <FaCheckCircle /> Fulfilled
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="text-yellow-600 font-medium flex items-center gap-1">
            <FaClock /> Pending
          </span>
        );
    }
  };

  // --- CRUD & Status Handlers ---

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setSelectedNeed(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const result = await dispatch(
      deleteResource({ resource: "needs", id: deleteId })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setToast({
        message: "Need Report deleted successfully.",
        type: "success",
      });
      dispatch(fetchResources({ resource: "needs" }));
    } else {
      setToast({
        message: result.payload || "Failed to delete report.",
        type: "error",
      });
    }

    setDeleteId(null);
    setSelectedNeed(null);
    setIsConfirmOpen(false);
  };

  const handleStatusChange = async (id, newStatus, message) => {
    const result = await dispatch(
      updateResource({ resource: "needs", id, body: { status: newStatus } })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setToast({
        message: message || `Status updated to ${newStatus}.`,
        type: "success",
      });
      dispatch(fetchResources({ resource: "needs" }));
    } else {
      setToast({
        message: result.payload || "Failed to update status.",
        type: "error",
      });
    }
  };

  const handleView = (row) => setSelectedNeed(row);

  // --- DataTable Configuration ---

  const tableHeader = [
    { label: "Item/Need", key: "title" },
    { label: "Branch", key: "branch.name" },
    { label: "Quantity", key: "quantityOrAmount" },
    {
      label: "Date",
      key: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
      render: (row) => getStatusDisplay(row.status),
    },
  ];

  const getButtons = (row) => {
    let buttons = [
      {
        icon: <FaEye />,
        className: "bg-blue-500 hover:bg-blue-600 text-white",
        onClick: handleView,
        title: "View Details",
      },
      {
        icon: <FaTrash />,
        className: "bg-red-600 hover:bg-red-700 text-white",
        onClick: handleDelete,
        title: "Delete Report",
      },
    ];

    // Status Change Buttons
    if (row.status === "PENDING") {
      buttons.push(
        {
          icon: <FaCheckCircle />,
          className: "bg-green-500 hover:bg-green-600 text-white",
          onClick: () =>
            handleStatusChange(row._id, "APPROVED", "Need approved."),
          title: "Approve Need",
        },
        {
          icon: <FaTimesCircle />,
          className: "bg-orange-500 hover:bg-orange-600 text-white",
          onClick: () =>
            handleStatusChange(row._id, "REJECTED", "Need rejected."),
          title: "Reject Need",
        }
      );
    }

    // Publish Toggle logic removed

    return buttons;
  };

  // --- Render ---

  return (
    <div className="p-6">
      {isToastOpen && (
        <Toast
          message={isToastOpen.message}
          type={isToastOpen.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
          <FaBullhorn /> Need Reports Management (Head Office)
        </h1>
      </div>

      {status === "loading" && !allNeeds?.length ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">
            Loading all need reports...
          </span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : allNeeds?.length > 0 ? (
        <DataTable
          heading="All Branch Needs"
          tableHeader={tableHeader}
          tableData={allNeeds}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-lg font-medium">
            No needs reported by any branch yet.
          </p>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedNeed}
        onClose={() => setSelectedNeed(null)}
        headerTitle="Need Report Details"
        size="md"
      >
        {selectedNeed ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-700">
              {selectedNeed.title}
            </h3>

            <p className="text-sm border-b pb-2 mb-2">
              <strong className="flex items-center gap-1">
                <FaBuilding /> Branch:
              </strong>{" "}
              {selectedNeed.branch?.name || selectedNeed.branch}
            </p>

            <p>
              <strong>Status:</strong> {getStatusDisplay(selectedNeed.status)}
            </p>
            <p>
              <strong>Quantity/Amount:</strong> {selectedNeed.quantityOrAmount}
            </p>
            <p>
              <strong>Description:</strong> {selectedNeed.description}
            </p>
            <p className="text-sm text-gray-500 pt-2 border-t mt-4">
              <strong>Reported On:</strong>{" "}
              {new Date(selectedNeed.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Loading report details...</p>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the report: "${
          selectedNeed?.title
        }" from ${
          selectedNeed?.branch?.name || "the branch"
        }? This action is permanent.`}
      />
    </div>
  );
};

export default NeedReportsManagementPage;
