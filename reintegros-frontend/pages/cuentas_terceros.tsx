import React from 'react';

import Layout from '../components/common/Layout/Layout';
import CuentasTerceros from '../components/cuentas/terceros/CuentasTerceros';
import { withAuth } from '../components/api-call/auth';
const Page = () => (
  <Layout>
    <CuentasTerceros />
  </Layout>
);

export default function CuentasTercerosPage() {
  return Page();
  // return withAuth(Page);
}
