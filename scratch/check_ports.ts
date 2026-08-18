async function checkPorts() {
  const ports = [
    { name: "Customer", url: "http://localhost:3000" },
    { name: "Business", url: "http://localhost:3001" },
    { name: "Admin", url: "http://localhost:3002" },
    { name: "API Health", url: "http://localhost:4000/health" },
  ];

  console.log("\n=======================================================");
  console.log("Checking Service Availability Across All 4 Monorepo Ports");
  console.log("=======================================================\n");

  let allReady = true;
  for (const p of ports) {
    try {
      const res = await fetch(p.url);
      if (res.ok) {
        console.log(`🟢 [PASS] ${p.name} (${p.url}) -> HTTP ${res.status}`);
      } else {
        console.log(`🟡 [WARN] ${p.name} (${p.url}) -> HTTP ${res.status}`);
        allReady = false;
      }
    } catch (err: any) {
      console.log(`🔴 [FAIL] ${p.name} (${p.url}) -> Unreachable (${err.message})`);
      allReady = false;
    }
  }

  if (!allReady) {
    console.error("\nSome services are not responding properly.");
  } else {
    console.log("\n✅ ALL 4 MONOREPO DEV SERVICES ARE UP & RESPONDING WITH HTTP 200!");
  }
}

checkPorts();
