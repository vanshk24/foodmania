import dns from "dns/promises";

async function testDns() {
  const hosts = [
    "aws-0-ap-southeast-1.pooler.supabase.com",
    "db.pkcrfmafvaunmatnnueq.supabase.co",
    "pkcrfmafvaunmatnnueq.supabase.co",
    "aws-0-ap-south-1.pooler.supabase.com",
    "aws-0-us-east-1.pooler.supabase.com",
  ];

  for (const h of hosts) {
    try {
      const ips = await dns.lookup(h);
      console.log(`✅ Host ${h} -> ${ips.address}`);
    } catch (e: any) {
      console.log(`❌ Host ${h} -> ${e.message}`);
    }
  }
}

testDns();
