async function checkServices() {
  const services = [
    { name: "Customer", url: "http://localhost:3000" },
    { name: "Business", url: "http://localhost:3001" },
    { name: "Admin", url: "http://localhost:3002" },
    { name: "API Health", url: "http://localhost:4000/health" },
  ];

  console.log("=======================================================");
  console.log("🌐 SERVICE HEALTH VERIFICATION:");
  console.log("=======================================================");

  for (const s of services) {
    try {
      const res = await fetch(s.url);
      console.log(`✅ ${s.name.padEnd(12)} (${s.url}): Status ${res.status}`);
    } catch (e: any) {
      console.log(`❌ ${s.name.padEnd(12)} (${s.url}): ${e.message}`);
    }
  }
  console.log("=======================================================\n");
}

checkServices();
