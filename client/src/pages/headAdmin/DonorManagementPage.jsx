import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, deleteResource } from "@/redux/slices/resourcesSLice";

import { DataTable, ConfirmationModal, Toast, Modal } from "@/components";

import { FaTrash, FaEye } from "react-icons/fa";

const DonorManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [toast, setToast] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // For View Modal
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    dispatch(fetchResources({ resource: "users" }));
  }, [dispatch]);



  const donorList = data.users?.filter((u) => u.role === "DONOR") || [];

  const handleView = (row) => {
    setSelectedDonor(row);
    setIsViewOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await dispatch(
        deleteResource({ resource: "users", id: deleteId })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setToast({ message: "Donor deleted successfully.", type: "success" });
        dispatch(fetchResources({ resource: "users" }));
      } else {
        setToast({
          message: result.payload || "Failed to delete donor.",
          type: "error",
        });
      }

      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  const tableHeader = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Created On", key: "createdAt" },
  ];

  // ⬇⬇⬇ NEW: Add View + Delete buttons
  const getButtons = () => [
    {
      icon: <FaEye />,
      className: "bg-blue-600 hover:bg-blue-700 text-white",
      onClick: handleView,
      title: "View",
    },
    {
      icon: <FaTrash />,
      className: "bg-red-600 hover:bg-red-700 text-white",
      onClick: handleDelete,
      title: "Delete",
    },
  ];

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
          Donor Management
        </h1>
      </div>

      {status === "loading" ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading donors...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donorList.length > 0 ? (
        <DataTable
          heading="All Donors"
          tableHeader={tableHeader}
          tableData={donorList}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No donors found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Donor role walay users yahan show honge.
          </p>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this donor?"
      />
 
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        headerTitle="Donor Details"
        size="md"
        showSecondaryActionButton={false}
        showPrimaryActionButton={false}
      >
        {selectedDonor && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl shadow-xs border border-orange-100 bg-orange-50">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-600 text-white text-3xl font-bold shadow-md">
                {selectedDonor.name.charAt(0)}
              </div>

              <h2 className="text-xl font-semibold text-gray-600 mt-3">
                {selectedDonor.name}
              </h2>

              <p className="text-sm text-gray-600">{selectedDonor.email}</p>

              <p className="text-xs text-gray-500 mt-1">
                ID: {selectedDonor._id}
              </p>
            </div>

            {/* Details Card */}
            <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Role:</span>
                <span className="col-span-2 text-orange-600">
                  {selectedDonor.role}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Phone:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedDonor.phoneNumber}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Address:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedDonor.address || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Status:</span>
                <span className="col-span-2">
                  {selectedDonor.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Created:</span>
                <span className="col-span-2 text-gray-800">
                  {new Date(selectedDonor.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-600">Updated:</span>
                <span className="col-span-2 text-gray-800">
                  {new Date(selectedDonor.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonorManagementPage;
