/**
 * Food Mania — Phase 9 Super Admin Security & Authorization Test Suite
 */

const API_BASE_URL = "http://localhost:4000";

async function runAdminSecurityTests() {
  console.log("\n=======================================================");
  console.log("🔒 RUNNING PHASE 9 SUPER ADMIN SECURITY TEST SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let total = 0;

  // 1. Super Admin Authentication
  total++;
  let adminToken = "";
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@foodmania.com", password: "admin123", twoFactorCode: "123456" }),
    });
    const json = await res.json();
    adminToken = json.data?.token || json.token || "";
    if (res.ok && adminToken) {
      console.log(`✅ [1. Super Admin Auth] Authenticated as Super Admin. Token obtained.`);
      passed++;
    } else {
      console.error(`❌ [1. Super Admin Auth] Login failed.`);
    }
  } catch (e: any) {
    console.error(`❌ [1. Super Admin Auth] Error: ${e.message}`);
  }

  // 2. Customer Authentication
  let customerToken = "";
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "gaurav@example.com", password: "password123" }),
    });
    const json = await res.json();
    customerToken = json.data?.token || json.token || "";
  } catch {}

  // 3. Unauthenticated Access Blocked on Admin Users
  total++;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`);
    if (res.status === 401 || res.status === 403) {
      console.log(`✅ [2. Unauthenticated Protection] GET /admin/users blocked with HTTP ${res.status}`);
      passed++;
    } else {
      console.error(`❌ [2. Unauthenticated Protection] Failed with HTTP ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ [2. Unauthenticated Protection] Error: ${e.message}`);
  }

  // 4. Customer Access Blocked on Admin Users
  total++;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (res.status === 403 || res.status === 401) {
      console.log(`✅ [3. Customer Role Protection] Customer blocked from GET /admin/users (HTTP ${res.status})`);
      passed++;
    } else {
      console.error(`❌ [3. Customer Role Protection] Customer got HTTP ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ [3. Customer Role Protection] Error: ${e.message}`);
  }

  // 5. Super Admin Authorized Access to /admin/users
  total++;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status === 200) {
      console.log(`✅ [4. Super Admin Authorized Access] GET /admin/users returned HTTP 200 OK`);
      passed++;
    } else {
      console.error(`❌ [4. Super Admin Authorized Access] Got HTTP ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ [4. Super Admin Authorized Access] Error: ${e.message}`);
  }

  // 6. Super Admin Authorized Access to /admin/restaurants
  total++;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/restaurants`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status === 200) {
      console.log(`✅ [5. Super Admin Authorized Access] GET /admin/restaurants returned HTTP 200 OK`);
      passed++;
    } else {
      console.error(`❌ [5. Super Admin Authorized Access] Got HTTP ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ [5. Super Admin Authorized Access] Error: ${e.message}`);
  }

  console.log("\n=======================================================");
  console.log(`📊 SUPER ADMIN SECURITY SUITE SUMMARY: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("=======================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runAdminSecurityTests();
