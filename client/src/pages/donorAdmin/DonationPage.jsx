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
  Modal,
  FormModal,
  Button,
  ConfirmationModal,
  Toast,
} from "@/components";
import { FaTrash, FaEdit, FaEye, FaPlus, FaReceipt } from "react-icons/fa";

export const DonationManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const resource = user ? `donations/donor/${user._id}` : null;
  const donations = data[resource] || [];

  useEffect(() => {
    if (resource) {
      dispatch(fetchResources({ resource }));
    }
    dispatch(fetchResources({ resource: "branches" }));
  }, [dispatch, resource]);

  const handleAddNew = () => {
    setFormMode("add");
    setSelectedDonation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setFormMode("edit");
    setSelectedDonation(row);
    setIsFormOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await dispatch(
        deleteResource({ resource: "donations", id: deleteId })
      );
      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: "Donation deleted successfully.",
          type: "success",
        });
        if (resource) {
          dispatch(fetchResources({ resource }));
        }
      } else {
        setToast({
          message: result.payload || "Failed to delete donation.",
          type: "error",
        });
      }
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let result;
      const body = {
        branch: formData.branch,
        amount: formData.amount,
        receiptImage: formData.receiptImage, // file handled in slice
        notes: formData.notes || "",
        donor: user._id, // Add donor id to the body
      };
      console.log(body);

      if (formMode === "add") {
        result = await dispatch(
          createResource({ resource: "donations/create", body })
        );
      } else {
        result = await dispatch(
          updateResource({
            resource: "donations",
            id: selectedDonation._id,
            body,
          })
        );
      }

      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: `Donation ${
            formMode === "add" ? "created" : "updated"
          } successfully.`,
          type: "success",
        });
        if (resource) {
          dispatch(fetchResources({ resource }));
        }
        setIsFormOpen(false);
      } else {
        setToast({
          message: result.payload || "An error occurred.",
          type: "error",
        });
      }
    } catch (e) {
      console.error(e);
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableHeader = [
    { label: "Branch", key: "branch.name" },
    { label: "Amount", key: "amount" },
    { label: "Status", key: "status" },
    { label: "Created On", key: "createdAt" },
  ];

  const getButtons = () => [
    {
      icon: <FaEye />,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      onClick: (row) => setSelectedDonation(row),
      title: "View",
    },
    {
      icon: <FaEdit />,
      className: "bg-orange-500 hover:bg-orange-600 text-white",
      onClick: handleEdit,
      title: "Edit",
    },
    {
      icon: <FaTrash />,
      className: "bg-red-600 hover:bg-red-700 text-white",
      onClick: handleDelete,
      title: "Delete",
    },
  ];

  const getFormFields = () => [
    {
      label: "Branch",
      name: "branch",
      type: "dropdown",
      options: (data.branches || []).map((branch) => ({
        label: branch.name,
        value: branch._id,
      })),
      required: true,
    },
    { label: "Amount", name: "amount", type: "number", required: true },
    { label: "Receipt", name: "receiptImage", type: "image", required: true },
    { label: "Notes", name: "notes", type: "textarea", required: false },
  ];

  const getInitialData = () => {
    if (formMode === "edit" && selectedDonation) {
      return {
        branch: selectedDonation.branch?._id,
        amount: selectedDonation.amount,
        notes: selectedDonation.notes,
      };
    }
    return {};
  };

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
        <h1 className="text-3xl font-bold text-blue-700">My Donations</h1>
        <Button
          onClick={handleAddNew}
          variant="filled"
          color="orange"
          className="flex items-center gap-2"
        >
          <FaPlus /> Add Donation
        </Button>
      </div>

      {status === "loading" && !donations.length ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading donations...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donations.length > 0 ? (
        <DataTable
          heading="All Donations"
          tableHeader={tableHeader}
          tableData={donations}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No donations found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Click “Add Donation” to create a new one.
          </p>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedDonation && !isFormOpen}
        onClose={() => setSelectedDonation(null)}
        headerTitle="Donation Details"
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-4 text-sm">
            <p>
              <strong>Branch:</strong> {selectedDonation.branch?.name}
            </p>
            <p>
              <strong>Amount:</strong> {selectedDonation.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedDonation.status}
            </p>
            <p>
              <strong>Notes:</strong> {selectedDonation.notes || "-"}
            </p>
            {selectedDonation.receiptImage && (
              <div className="mt-2">
                <strong>Receipt:</strong>
                <img
                  src={selectedDonation.receiptImage}
                  alt="Receipt"
                  className="mt-1 max-w-full border rounded"
                />
              </div>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedDonation.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Loading donation details...</p>
        )}
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        headerTitle={formMode === "add" ? "Add Donation" : "Edit Donation"}
        size="md"
      >
        <FormModal
          isSubmitting={isSubmitting}
          submitText={formMode === "add" ? "Create Donation" : "Save Changes"}
          initialData={getInitialData()}
          fields={getFormFields()}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this donation?"
      />
    </div>
  );
};
