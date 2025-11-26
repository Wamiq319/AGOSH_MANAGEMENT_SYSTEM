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

      <Modal
        isOpen={!!selectedBranch && !isFormOpen}
        onClose={() => setSelectedBranch(null)}
        headerTitle={
          <span className="font-extrabold">
            Branch:{" "}
            <span className="text-blue-600">{selectedBranch?.name}</span>
          </span>
        }
        size="md"
        showSecondaryActionButton={false}
        showPrimaryActionButton={false}
      >
        {selectedBranch ? (
          <div className="space-y-6">
            {/* 1. BRANCH HEADER CARD  */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-orange-50 border border-orange-200 shadow-sm">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-600 text-white text-3xl font-bold mb-3 border-4 border-orange-200">
                <FaBuilding />
              </div>
              <h2 className="text-xl font-extrabold text-gray-800">
                {selectedBranch.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                {selectedBranch.location || "Location Not Provided"}
              </p>
            </div>

            {/* 2. BRANCH DETAILS CARD*/}
            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-xs space-y-3">
              <h3 className="text-lg font-semibold border-b border-orange-300 pb-1 mb-3 text-gray-700">
                <FaBuilding className="mr-2 text-blue-600 inline" /> Branch
                Information
              </h3>

              {/* Detail Item 1: Location */}
              <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center text-gray-600">
                  <span className="mr-3 text-lg text-red-500">
                    <FaMapMarkerAlt />
                  </span>
                  <span className="font-medium">Location:</span>
                </div>
                <span className="text-gray-700 text-right ml-4">
                  {selectedBranch.location}
                </span>
              </div>

              {/* Detail Item 2: Phone Number */}
              <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center text-gray-600">
                  <span className="mr-3 text-lg text-green-500">
                    <FaPhone />
                  </span>
                  <span className="font-medium">Phone Number:</span>
                </div>
                <span className="text-gray-700 font-semibold text-right ml-4">
                  {selectedBranch.phoneNumber}
                </span>
              </div>
            </div>

            {/* 3. PAYMENT DETAILS CARD */}
            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-xs space-y-3">
              <h3 className="text-lg font-semibold border-b border-orange-300 pb-1 mb-3 text-gray-700">
                <FaMoneyCheckAlt className="mr-2 text-green-600 inline" />{" "}
                Payment Information
              </h3>

              <div className="bg-green-50 p-3 rounded-lg border border-green-100 space-y-3">
                {/* Detail Item 1: Bank Name */}
                <div className="flex justify-between items-center py-1 border-b border-green-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-green-700">
                      <FaMoneyCheckAlt />
                    </span>
                    <span className="font-medium">Bank / Service:</span>
                  </div>
                  <span className="text-gray-800 text-right font-semibold ml-4">
                    {selectedBranch.paymentInfo?.bankName || "N/A"}
                  </span>
                </div>

                {/* Detail Item 2: Account Title */}
                <div className="flex justify-between items-center py-1 border-b border-green-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-green-700">
                      <FaUserTie />
                    </span>
                    <span className="font-medium">Account Title:</span>
                  </div>
                  <span className="text-gray-800 text-right font-semibold ml-4">
                    {selectedBranch.paymentInfo?.accountTitle || "N/A"}
                  </span>
                </div>

                {/* Detail Item 3: Account Number */}
                <div className="flex justify-between items-center py-1 border-b border-green-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-green-700">
                      <FaShieldAlt />
                    </span>
                    <span className="font-medium">Account Number:</span>
                  </div>
                  <span className="font-mono text-base font-bold text-green-800 text-right ml-4">
                    {selectedBranch.paymentInfo?.accountNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. ADMIN DETAILS CARD */}
            {selectedBranch.admin && (
              <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-xs space-y-3">
                <h3 className="text-lg font-semibold border-b border-orange-300  pb-1 mb-3 text-gray-700">
                  <FaUserTie className="mr-2 text-purple-600 inline" /> Admin
                  Information
                </h3>

                {/* Detail Item 1: Admin Name */}
                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-purple-500">
                      <FaUserTie />
                    </span>
                    <span className="font-medium">Name:</span>
                  </div>
                  <span className="text-gray-700 text-right ml-4">
                    {selectedBranch.admin.name}
                  </span>
                </div>

                {/* Detail Item 2: Admin Email */}
                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-purple-500">
                      <FaEnvelope />
                    </span>
                    <span className="font-medium">Email:</span>
                  </div>
                  <span className="text-gray-700 text-right ml-4">
                    {selectedBranch.admin.email}
                  </span>
                </div>

                {/* Detail Item 3: Admin Role */}
                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-3 text-lg text-purple-500">
                      <FaShieldAlt />
                    </span>
                    <span className="font-medium">Role:</span>
                  </div>
                  <span className="text-gray-700 text-right ml-4">
                    {selectedBranch.admin.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Loading branch details...</p>
        )}
      </Modal>
      {/* Form Modal */}
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
