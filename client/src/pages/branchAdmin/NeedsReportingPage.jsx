import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
} from "@/redux/slices/resourcesSLice";

import {
  DataTable,
  ConfirmationModal,
  Modal,
  Button,
  FormModal,
  Toast,
} from "@/components";

import {
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

export const NeedsReportingPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const branchId = user?.branch?._id || user?.branch;

  const needsForBranch = (data.needs || []).filter(
    (need) => need.branch?._id === branchId || need.branch === branchId
  );

  // Initial data fetch
  useEffect(() => {
    if (branchId) {
      dispatch(fetchResources({ resource: "needs" }));
    }
  }, [dispatch, branchId]);

  // --- CRUD Handlers ---

  const handleAddNew = () => {
    setSelectedNeed(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleView = (row) => setSelectedNeed(row);

  const handleEdit = (row) => {
    if (row.status !== "PENDING") {
      setToast({
        message: "Only pending reports can be edited.",
        type: "error",
      });
      return;
    }
    setSelectedNeed(row);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleDelete = (row) => {
    if (row.status !== "PENDING") {
      setToast({
        message: "Only pending reports can be deleted.",
        type: "error",
      });
      return;
    }
    setDeleteId(row._id);
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
    setIsConfirmOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    const body = {
      title: formData.title,
      description: formData.description,
      quantityOrAmount: formData.quantityOrAmount,
      branch: branchId,
      status: formMode === "add" ? "PENDING" : selectedNeed.status,
    };

    let result;

    if (formMode === "add") {
      result = await dispatch(createResource({ resource: "needs", body }));
    } else {
      result = await dispatch(
        updateResource({ resource: "needs", id: selectedNeed._id, body })
      );
    }

    if (result.meta.requestStatus === "fulfilled") {
      setToast({
        message: `Need Report ${
          formMode === "add" ? "submitted" : "updated"
        } successfully.`,
        type: "success",
      });

      dispatch(fetchResources({ resource: "needs" }));
      setIsFormOpen(false);
      setSelectedNeed(null);
    } else {
      setToast({
        message: result.payload || "An error occurred during submission.",
        type: "error",
      });
    }

    setIsSubmitting(false);
  };

  // --- DataTable Configuration Helpers ---

  const getStatusDisplay = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="text-green-600 font-medium">
            Approved <FaCheckCircle className="inline ml-1" />
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-red-500 font-medium">
            Rejected <FaTimesCircle className="inline ml-1" />
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="text-yellow-600 font-medium">
            Pending <FaClock className="inline ml-1" />
          </span>
        );
    }
  };

  const tableHeader = [
    { label: "Item/Need", key: "title" },
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

  const getButtons = (row) => [
    {
      icon: <FaEye />,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      onClick: handleView,
      title: "View Details",
    },
    {
      icon: <FaEdit />,
      className:
        row.status === "PENDING"
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : "bg-gray-400 text-gray-700 cursor-not-allowed",
      onClick:
        row.status === "PENDING"
          ? handleEdit
          : () =>
              setToast({
                message: "Only pending reports can be edited.",
                type: "warning",
              }),
      title: row.status === "PENDING" ? "Edit" : "Cannot Edit",
    },
    {
      icon: <FaTrash />,
      className:
        row.status === "PENDING"
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-gray-400 text-gray-700 cursor-not-allowed",
      onClick:
        row.status === "PENDING"
          ? handleDelete
          : () =>
              setToast({
                message: "Only pending reports can be deleted.",
                type: "warning",
              }),
      title: row.status === "PENDING" ? "Delete" : "Cannot Delete",
    },
  ];

  // --- Form Configuration ---

  const getFormFields = () => [
    {
      label: "Need/Item Title",
      name: "title",
      type: "text",
      required: true,
      icon: FaPaperPlane,
    },
    {
      label: "Quantity/Amount Required",
      name: "quantityOrAmount",
      type: "text",
      required: true,
      placeholder: "e.g., 150 pairs, 100 kg Rice, 50,000 PKR",
    },
    {
      label: "Detailed Description",
      name: "description",
      type: "textarea",
      required: true,
      placeholder: "Explain kyun zaroorat hai aur yeh kis kaam aayega.",
    },
  ];

  const getInitialData = () => {
    if (formMode === "edit" && selectedNeed) {
      return {
        title: selectedNeed.title || "",
        quantityOrAmount: selectedNeed.quantityOrAmount || "",
        description: selectedNeed.description || "",
      };
    }
    return {};
  };

  // --- Render ---

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <FaPaperPlane /> Branch Needs Reporting
        </h1>

        <Button
          onClick={handleAddNew}
          variant="filled"
          color="blue"
          className="flex items-center gap-2"
        >
          <FaPlus /> New Need Report
        </Button>
      </div>

      {status === "loading" && !data.needs?.length ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading reports...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : needsForBranch?.length > 0 ? (
        <DataTable
          heading="My Submitted Needs"
          tableHeader={tableHeader}
          tableData={needsForBranch}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-lg font-medium">No need reports found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Click “New Need Report” to submit a new requirement to Head Office.
          </p>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedNeed && !isFormOpen}
        onClose={() => setSelectedNeed(null)}
        headerTitle="Need Report Details"
        size="md"
      >
        {selectedNeed ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-700">
              {selectedNeed.title}
            </h3>

            <p>
              {/* Status display */}
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

      {/* Form Modal (Add/Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        headerTitle={
          formMode === "add" ? "Submit New Need Report" : "Edit Need Report"
        }
        size="md"
      >
        <FormModal
          isSubmitting={isSubmitting}
          submitText={formMode === "add" ? "Send Report" : "Save Changes"}
          initialData={getInitialData()}
          fields={getFormFields()}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the report: "${selectedNeed?.title}"?`}
      />
    </div>
  );
};

export default NeedsReportingPage;
