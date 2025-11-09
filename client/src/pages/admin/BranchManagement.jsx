import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, deleteResource } from "@/redux/slices/resourcesSLice";
import {
  DataTable,
  ConfirmationModal,
  Modal,
  Button,
  FormModal,
} from "@/components";
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";

export const BranchesManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");

  // Fetch branches
  useEffect(() => {
    dispatch(fetchResources({ resource: "branches" }));
  }, [dispatch]);

  // Handle Delete
  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteResource({ resource: "branches", id: deleteId }));
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  // Handle Edit/View
  const handleView = (row) => {
    setSelectedBranch(row);
  };

  const handleEdit = (row) => {
    setFormMode("edit");
    setSelectedBranch(row);
    setIsFormOpen(true);
  };

  // Add New Branch
  const handleAddNew = () => {
    setFormMode("add");
    setSelectedBranch(null);
    setIsFormOpen(true);
  };

  const tableHeader = [
    { label: "Branch Name", key: "name" },
    { label: "Location", key: "location" },
    { label: "Phone", key: "phone" },
    { label: "Created On", key: "createdAt" },
  ];

  const getButtons = () => [
    {
      icon: <FaEye />,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      onClick: handleView,
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Branches Management
        </h1>
        <Button
          onClick={handleAddNew}
          variant="filled"
          color="orange"
          className="flex items-center gap-2"
        >
          <FaPlus /> Add Branch
        </Button>
      </div>

      {/* Table or Loading */}
      {status === "loading" && !data.branches?.length ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading branches...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.branches?.length > 0 ? (
        <DataTable
          heading="All Branches"
          tableHeader={tableHeader}
          tableData={data.branches}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No branches found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Click “Add Branch” to create a new one.
          </p>
        </div>
      )}

      {/* ---------- View Modal ---------- */}
      <Modal
        isOpen={!!selectedBranch && !isFormOpen}
        onClose={() => setSelectedBranch(null)}
        headerTitle="Branch Details"
        size="md"
      >
        {selectedBranch ? (
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Branch Name:</strong> {selectedBranch.name}
            </p>
            <p>
              <strong>Location:</strong> {selectedBranch.location}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBranch.phone}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedBranch.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Loading branch details...</p>
        )}
      </Modal>

      {/* ---------- Form Modal (Add/Edit) ---------- */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        headerTitle={formMode === "add" ? "Add Branch" : "Edit Branch"}
        size="md"
      >
        <FormModal
          initialData={formMode === "edit" ? selectedBranch : {}}
          fields={[
            {
              label: "Branch Name",
              name: "name",
              type: "text",
              required: true,
            },
            {
              label: "Location",
              name: "location",
              type: "text",
              required: true,
            },
            { label: "Phone", name: "phone", type: "text", required: true },
          ]}
          onSubmit={(formData) => {
            console.log("Form Data:", formData);
            setIsFormOpen(false);
          }}
        />
      </Modal>

      {/* ---------- Delete Confirmation ---------- */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};
