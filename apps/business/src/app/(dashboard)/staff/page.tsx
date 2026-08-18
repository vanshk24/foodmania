"use client";

import React, { useState } from "react";
import { UserCheck, Plus, Shield, Clock, Phone } from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";

interface StaffMember {
  id: string;
  name: string;
  role: "Head Chef" | "Sous Chef" | "Floor Manager" | "Lead Waiter";
  phone: string;
  shift: "Morning (8 AM - 4 PM)" | "Evening (4 PM - 12 AM)" | "Full Day";
  status: "on-duty" | "off-duty";
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "st-1", name: "Chef Vikram Singh", role: "Head Chef", phone: "+91 98765 11111", shift: "Evening (4 PM - 12 AM)", status: "on-duty" },
  { id: "st-2", name: "Ananya Verma", role: "Floor Manager", phone: "+91 98765 22222", shift: "Full Day", status: "on-duty" },
  { id: "st-3", name: "Rohan Das", role: "Lead Waiter", phone: "+91 98765 33333", shift: "Evening (4 PM - 12 AM)", status: "on-duty" },
];

export default function BusinessStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffMember["role"]>("Head Chef");
  const [phone, setPhone] = useState("");

  const handleAddStaff = () => {
    if (!name.trim()) return;
    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name,
      role,
      phone: phone || "+91 98000 00000",
      shift: "Evening (4 PM - 12 AM)",
      status: "on-duty",
    };
    setStaff([newStaff, ...staff]);
    setName("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <UserCheck className="text-[#FF6B4A]" />
            <span>Staff & Team Operations</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage kitchen chefs, floor waiters, staff roles, and attendance shifts.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="min-h-[44px]">
          <Plus size={18} />
          <span>Add Staff Member</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staff.map((s) => (
          <Card key={s.id} padding="md" className="space-y-3 bg-white border border-[#ECECEC] shadow-card">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#222222]">{s.name}</h3>
                <p className="text-xs text-[#FF6B4A] font-bold">{s.role}</p>
              </div>
              <Badge variant={s.status === "on-duty" ? "success" : "default"} size="sm">
                {s.status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-[#666666]">
              <div className="flex justify-between"><span>Phone:</span> <strong className="text-[#222222]">{s.phone}</strong></div>
              <div className="flex justify-between"><span>Shift:</span> <strong>{s.shift}</strong></div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member">
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold text-[#222222] block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suresh Kumar"
              className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] p-3 text-xs text-[#222222] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#222222] block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] p-3 text-xs text-[#222222] focus:outline-none"
            >
              <option value="Head Chef">Head Chef</option>
              <option value="Sous Chef">Sous Chef</option>
              <option value="Floor Manager">Floor Manager</option>
              <option value="Lead Waiter">Lead Waiter</option>
            </select>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleAddStaff} className="min-h-[48px]">
            <span>Save Staff Member</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
