// ===============================
// Updated StudentManagementPage.jsx
// ===============================
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
  FaUserGraduate,
  FaCalendarAlt,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export const StudentManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const branchId = user?.branch?._id || user?.branch;

  const studentsForBranch = data.students?.filter(
    (student) => student.branch?._id === branchId
  );

  useEffect(() => {
    dispatch(fetchResources({ resource: "students" }));
  }, [dispatch]);

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const result = await dispatch(
      deleteResource({ resource: "students", id: deleteId })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setToast({ message: "Student deleted successfully.", type: "success" });
      dispatch(fetchResources({ resource: "students" }));
    } else {
      setToast({ message: "Failed to delete student.", type: "error" });
    }

    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  const handleView = (row) => setSelectedStudent(row);

  const handleEdit = (row) => {
    setSelectedStudent(row);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStudent(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    const cleanGenderValue =
      typeof formData.gender === "object" && formData.gender?.target
        ? formData.gender.target.value
        : formData.gender;

    const body = {
      name: formData.name,
      branch: user.branch,
      dateOfBirth: formData.dateOfBirth,
      guardianName: formData.guardianName,
      gender: cleanGenderValue,
      contactNumber: formData.contactNumber,
      address: formData.address,
    };

    let result;

    if (formMode === "add") {
      result = await dispatch(createResource({ resource: "students", body }));
    } else {
      result = await dispatch(
        updateResource({ resource: "students", id: selectedStudent._id, body })
      );
    }

    if (result.meta.requestStatus === "fulfilled") {
      setToast({
        message: `Student ${
          formMode === "add" ? "created" : "updated"
        } successfully.`,
        type: "success",
      });

      dispatch(fetchResources({ resource: "students" }));
      setIsFormOpen(false);
    } else {
      setToast({
        message: result.payload || "An error occurred.",
        type: "error",
      });
    }

    setIsSubmitting(false);
  };

  const tableHeader = [
    { label: "Student Name", key: "name" },
    { label: "Branch", key: "branch.name" },
    { label: "Guardian", key: "guardianName" },
    { label: "Contact", key: "contactNumber" },
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

  const getFormFields = () => [
    { label: "Student Name", name: "name", type: "text", required: true },
    { label: "Date of Birth", name: "dateOfBirth", type: "date" },
    { label: "Guardian Name", name: "guardianName", type: "text" },
    {
      label: "Gender",
      name: "gender",
      type: "dropdown",
      required: true,
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
      ],
    },
    { label: "Contact Number", name: "contactNumber", type: "text" },
    { label: "Address", name: "address", type: "textarea" },
  ];

  const getInitialData = () => {
    if (formMode === "edit" && selectedStudent) {
      return {
        name: selectedStudent.name || "",
        dateOfBirth: selectedStudent.dateOfBirth
          ? selectedStudent.dateOfBirth.split("T")[0]
          : "",
        guardianName: selectedStudent.guardianName || "",
        gender: selectedStudent.gender || "",
        contactNumber: selectedStudent.contactNumber || "",
        address: selectedStudent.address || "",
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
        <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
          <FaUserGraduate /> Student Management
        </h1>

        <Button
          onClick={handleAddNew}
          variant="filled"
          color="orange"
          className="flex items-center gap-2"
        >
          <FaPlus /> Add Student
        </Button>
      </div>

      {status === "loading" && !data.students?.length ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading students...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.students?.length > 0 ? (
        <DataTable
          heading="All Students"
          tableHeader={tableHeader}
          tableData={studentsForBranch}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-lg font-medium">No students found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Click “Add Student” to register a new student.
          </p>
        </div>
      )}

      <Modal
        isOpen={!!selectedStudent && !isFormOpen}
        onClose={() => setSelectedStudent(null)}
        headerTitle="Student Details"
        size="md"
      >
        {selectedStudent ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-orange-600 border-b pb-2 mb-3 flex items-center">
                <FaUserGraduate className="mr-2" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {selectedStudent.name}
                </p>
                <p>
                  <strong>Guardian:</strong>{" "}
                  {selectedStudent.guardianName || "-"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {selectedStudent.dateOfBirth
                    ? new Date(selectedStudent.dateOfBirth).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedStudent.isActive ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <FaTimesCircle /> Inactive
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 border-b pb-2 mb-3 flex items-center">
                <FaUserTie className="mr-2" /> Branch Information
              </h3>
              <p>
                <strong>Branch:</strong> {selectedStudent.branch?.name}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 border-b pb-2 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2" /> System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedStudent.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(selectedStudent.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading student details...</p>
        )}
      </Modal>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        headerTitle={formMode === "add" ? "Add Student" : "Edit Student"}
        size="md"
      >
        <FormModal
          isSubmitting={isSubmitting}
          submitText={formMode === "add" ? "Create Student" : "Save Changes"}
          initialData={getInitialData()}
          fields={getFormFields()}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};
