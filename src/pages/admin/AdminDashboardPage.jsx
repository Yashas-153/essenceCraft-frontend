import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDashboard from '../../components/admin/AdminDashboard';
import { withAdminAuth } from '../../hooks/useAdminAuth';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default withAdminAuth(AdminDashboardPage);