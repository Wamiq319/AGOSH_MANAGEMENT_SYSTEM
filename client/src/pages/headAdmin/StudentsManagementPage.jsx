import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, deleteResource } from "@/redux/slices/resourcesSLice";

import { DataTable, ConfirmationModal, Toast, Modal } from "@/components";

import { FaTrash, FaEye } from "react-icons/fa";

const StudentsManagementPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [toast, setToast] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // For View Modal
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchResources({ resource: "students" }));
  }, [dispatch]);

  const studentList = data.students || [];

  // View
  const handleView = (row) => {
    setSelectedStudent(row);
    setIsViewOpen(true);
  };

  // Delete
  const handleDelete = (row) => {
    setDeleteId(row._id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await dispatch(
        deleteResource({ resource: "students", id: deleteId })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: "Student deleted successfully.",
          type: "success",
        });
        dispatch(fetchResources({ resource: "students" }));
      } else {
        setToast({
          message: result.payload || "Failed to delete student.",
          type: "error",
        });
      }

      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  const tableHeader = [
    { label: "Name", key: "name" },
    { label: "Guardian Name", key: "guardianName" },
    { label: "Phone", key: "contactNumber" },
    { label: "Branch", key: "branch.name" },
  ];

  // View / Delete Buttons
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

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
          Students Management
        </h1>
      </div>

      {status === "loading" ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading students...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : studentList.length > 0 ? (
        <DataTable
          heading="All Students"
          tableHeader={tableHeader}
          tableData={studentList}
          dynamicButtons={getButtons}
        />
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No students found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Currently no student data is available.
          </p>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student?"
      />

      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        headerTitle="Student Details"
        size="md"
        showSecondaryActionButton={false}
        showPrimaryActionButton={false}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* PROFILE HEADER */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-xs border border-orange-200 bg-orange-50">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-600 text-white text-3xl font-bold shadow-md uppercase">
                {selectedStudent.name?.charAt(0)}
              </div>

              <h2 className="text-xl  font-semibold text-gray-800 mt-3">
                {selectedStudent.name}
              </h2>

              <p className="text-sm text-gray-600">
                {selectedStudent.branch?.name || "No Branch"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                ID: {selectedStudent._id}
              </p>
            </div>

            {/* DETAILS CARD */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
              {/* Guardian */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Guardian:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedStudent.guardianName || "N/A"}
                </span>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Phone:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedStudent.contactNumber || "N/A"}
                </span>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Gender:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedStudent.gender || "N/A"}
                </span>
              </div>

              {/* DOB */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">DOB:</span>
                <span className="col-span-2 text-gray-800">
                  {formatDate(selectedStudent.dateOfBirth)}
                </span>
              </div>

              {/* Address */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedStudent.address || "N/A"}
                </span>
              </div>

              {/* Branch Location */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">
                  Branch Location:
                </span>
                <span className="col-span-2 text-gray-800">
                  {selectedStudent.branch?.location || "N/A"}
                </span>
              </div>

              {/* Enrollment Date */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Enrolled:</span>
                <span className="col-span-2 text-gray-800">
                  {formatDate(selectedStudent.enrollmentDate)}
                </span>
              </div>

              {/* Created */}
              <div className="grid grid-cols-3 gap-3">
                <span className="font-semibold text-gray-700">Created:</span>
                <span className="col-span-2 text-gray-800">
                  {formatDate(selectedStudent.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsManagementPage;
