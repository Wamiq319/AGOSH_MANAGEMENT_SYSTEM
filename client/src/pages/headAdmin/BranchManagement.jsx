import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResources,
  deleteResource,
  createResource,
  updateResource,
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
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaUserTie,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaMoneyCheckAlt, 
} from "react-icons/fa";

export const BranchesManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchResources({ resource: "branches" }));
  }, [dispatch]);

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await dispatch(
        deleteResource({ resource: "branches", id: deleteId })
      );
      if (result.meta.requestStatus === "fulfilled") {
        setToast({ message: "Branch deleted successfully.", type: "success" });
        dispatch(fetchResources({ resource: "branches" }));
      } else {
        setToast({
          message: result.payload || "Failed to delete branch.",
          type: "error",
        });
      }
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleView = (row) => {
    setSelectedBranch(row);
  };

  const handleEdit = (row) => {
    setFormMode("edit");
    setSelectedBranch(row);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setFormMode("add");
    setSelectedBranch(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let result;
      // 1. Destructure all fields including new Payment Info
      const {
        name,
        location,
        phoneNumber,
        accountTitle,
        bankName,
        accountNumber,
        adminName,
        adminEmail,
        adminPassword,
      } = formData;

      // 2. Prepare Branch Data Object
      const branchData = {
        name,
        location,
        phoneNumber,
        paymentInfo: {
          accountTitle,
          bankName,
          accountNumber,
        },
      };

      if (formMode === "add") {
        result = await dispatch(
          createResource({
            resource: "branches",
            body: {
              branch: branchData,
              admin: {
                name: adminName,
                email: adminEmail,
                password: adminPassword,
              },
            },
          })
        );
      } else {
        const admin = { name: adminName, email: adminEmail };
        if (adminPassword) {
          admin.password = adminPassword;
        }
        result = await dispatch(
          updateResource({
            resource: "branches",
            id: selectedBranch._id,
            body: {
              branch: branchData,
              admin,
            },
          })
        );
      }

      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: `Branch ${
            formMode === "add" ? "created" : "updated"
          } successfully.`,
          type: "success",
        });
        dispatch(fetchResources({ resource: "branches" }));
        setIsFormOpen(false);
      } else {
        setToast({
          message: result.payload || "An error occurred.",
          type: "error",
        });
      }
    } catch (e) {
      console.log(e);
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableHeader = [
    { label: "Branch Name", key: "name" },
    { label: "Location", key: "location" },
    { label: "Bank Name", key: "paymentInfo.bankName" }, // Showing Bank Name in table
    { label: "Admin", key: "admin.name" },
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

  const getFormFields = () => {
    const fields = [
      // Basic Info
      { label: "Branch Name", name: "name", type: "text", required: true },
      { label: "Location", name: "location", type: "text", required: true },
      {
        label: "Phone Number",
        name: "phoneNumber",
        type: "text",
        required: true,
      },

      // Payment Info (New Fields)
      {
        label: "Account Title",
        name: "accountTitle",
        type: "text",
        required: false,
        placeholder: "e.g. Agosh Rawalakot",
      },
      {
        label: "Bank / Service Name",
        name: "bankName",
        type: "text",
        required: false,
        placeholder: "e.g. Easypaisa / HBL",
      },
      {
        label: "Account Number",
        name: "accountNumber",
        type: "text",
        required: false,
        placeholder: "e.g. 0300-1234567",
      },

      // Admin Info
      { label: "Admin Name", name: "adminName", type: "text", required: true },
      {
        label: "Admin Email",
        name: "adminEmail",
        type: "email",
        required: true,
      },
    ];
    if (formMode === "add") {
      fields.push({
        label: "Admin Password",
        name: "adminPassword",
        type: "password",
        required: true,
      });
    } else {
      fields.push({
        label: "New Password",
        name: "adminPassword",
        type: "password",
        placeholder: "Leave blank to keep current password",
        required: false,
      });
    }
    return fields;
  };

  const getInitialData = () => {
    if (formMode === "edit" && selectedBranch) {
      return {
        name: selectedBranch.name,
        location: selectedBranch.location,
        phoneNumber: selectedBranch.phoneNumber,
        // Map Payment Info for Edit
        accountTitle: selectedBranch.paymentInfo?.accountTitle || "",
        bankName: selectedBranch.paymentInfo?.bankName || "",
        accountNumber: selectedBranch.paymentInfo?.accountNumber || "",
        // Map Admin Info
        adminName: selectedBranch.admin?.name,
        adminEmail: selectedBranch.admin?.email,
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

      {/* View Modal */}
      <Modal
        isOpen={!!selectedBranch && !isFormOpen}
        onClose={() => setSelectedBranch(null)}
        headerTitle="Branch Details"
        size="md"
      >
        {selectedBranch ? (
          <div className="space-y-6">
            {/* Branch Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 flex items-center">
                <FaBuilding className="mr-2" /> Branch Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FaBuilding className="text-gray-500 mr-3" />
                  <strong className="mr-2">Name:</strong> {selectedBranch.name}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-3" />
                  <strong className="mr-2">Location:</strong>{" "}
                  {selectedBranch.location}
                </div>
                <div className="flex items-center col-span-2">
                  <FaPhone className="text-gray-500 mr-3" />
                  <strong className="mr-2">Phone:</strong>{" "}
                  {selectedBranch.phoneNumber}
                </div>
              </div>
            </div>

            {/* Payment Details Section (New) */}
            <div>
              <h3 className="text-lg font-semibold text-green-700 border-b pb-2 mb-3 flex items-center">
                <FaMoneyCheckAlt className="mr-2" /> Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Bank / Service
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedBranch.paymentInfo?.bankName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Account Title
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedBranch.paymentInfo?.accountTitle || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Account Number
                  </span>
                  <span className="font-mono text-lg font-bold text-green-800">
                    {selectedBranch.paymentInfo?.accountNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Details Section */}
            {selectedBranch.admin && (
              <div>
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 flex items-center">
                  <FaUserTie className="mr-2" /> Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaUserTie className="text-gray-500 mr-3" />
                    <strong className="mr-2">Name:</strong>{" "}
                    {selectedBranch.admin.name}
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-500 mr-3" />
                    <strong className="mr-2">Email:</strong>{" "}
                    {selectedBranch.admin.email}
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="text-gray-500 mr-3" />
                    <strong className="mr-2">Role:</strong>{" "}
                    {selectedBranch.admin.role}
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2" /> System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong className="mr-2">Created:</strong>{" "}
                  {new Date(selectedBranch.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong className="mr-2">Last Updated:</strong>{" "}
                  {new Date(selectedBranch.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading branch details...</p>
        )}
      </Modal>

      {/* Form Modal (Add/Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        headerTitle={formMode === "add" ? "Add Branch" : "Edit Branch"}
        size="md"
      >
        <FormModal
          isSubmitting={isSubmitting}
          submitText={formMode === "add" ? "Create Branch" : "Save Changes"}
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
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};