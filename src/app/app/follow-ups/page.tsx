"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFollowUpsAction,
  createFollowUpTaskAction,
  completeFollowUpTaskAction,
  rescheduleFollowUpTaskAction,
  snoozeFollowUpTaskAction,
  FollowUpView,
} from "@/app/actions/followups";
import { getClientsAction, ClientWithMetrics } from "@/app/actions/clients";
import { getLeadsAction } from "@/app/actions/leads";
import { FollowUpTask, Lead, TaskType } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormField } from "@/components/ui/FormField";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Users,
  Plus,
  Sparkles,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export default function FollowUpsPage() {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [clients, setClients] = useState<ClientWithMetrics[]>([]);
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [currentView, setCurrentView] = useState<FollowUpView>("today");
  const [clientFilter, setClientFilter] = useState("all");
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Reschedule Modal State
  const [rescheduleTaskId, setRescheduleTaskId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleNotes, setRescheduleNotes] = useState("");

  // Create Task Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTaskLeadId, setNewTaskLeadId] = useState("");
  const [newTaskClientId, setNewTaskClientId] = useState("");
  const [newTaskDueAt, setNewTaskDueAt] = useState("");
  const [newTaskType, setNewTaskType] = useState<TaskType>("whatsapp");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  // WhatsApp Draft Modal State
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftTask, setDraftTask] = useState<FollowUpTask | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, clientsRes, leadsRes] = await Promise.all([
        getFollowUpsAction(currentView, clientFilter),
        getClientsAction(),
        getLeadsAction(),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
        setOverdueCount(tasksRes.overdueCount);
        setIsDemo(!!tasksRes.isDemo);
      } else {
        setError(tasksRes.error || "Failed to load follow-up tasks.");
      }

      if (clientsRes.success) {
        setClients(clientsRes.data);
        if (!newTaskClientId && clientsRes.data.length > 0) {
          setNewTaskClientId(clientsRes.data[0].id);
        }
      }

      if (leadsRes.success) {
        setAvailableLeads(leadsRes.data);
        if (!newTaskLeadId && leadsRes.data.length > 0) {
          setNewTaskLeadId(leadsRes.data[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentView, clientFilter]);

  const handleCompleteTask = async (taskId: string) => {
    const res = await completeFollowUpTaskAction(taskId);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || "Failed to complete task.");
    }
  };

  const handleSnoozeTask = async (taskId: string, days: number) => {
    const res = await snoozeFollowUpTaskAction(taskId, days);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || "Failed to snooze task.");
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleTaskId || !rescheduleDate) return;
    const res = await rescheduleFollowUpTaskAction(rescheduleTaskId, rescheduleDate, rescheduleNotes);
    if (res.success) {
      setRescheduleTaskId(null);
      setRescheduleDate("");
      setRescheduleNotes("");
      loadData();
    } else {
      alert(res.error || "Failed to reschedule task.");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const res = await createFollowUpTaskAction({
      leadId: newTaskLeadId,
      clientId: newTaskClientId,
      dueAt: newTaskDueAt || new Date(Date.now() + 86400000).toISOString(),
      taskType: newTaskType,
      notes: newTaskNotes,
    });

    if (res.success) {
      setCreateModalOpen(false);
      setNewTaskNotes("");
      loadData();
    } else {
      setCreateError(res.error || "Failed to schedule follow-up.");
    }
  };

  const openWhatsAppDraft = (task: FollowUpTask) => {
    setDraftTask(task);
    const leadName = task.lead?.name || "Client";
    const clientName = task.client?.name || "our agency";
    const sampleDraft = `Assalam o Alaikum ${leadName},\n\nI hope you are having a productive week. Following up on your recent enquiry with ${clientName}. We wanted to check if you had any questions regarding the quotation or package specifications?\n\nPlease let us know if today is a good time for a brief 5-minute call.\n\nBest regards,\nPrime Digital Team`;
    setDraftMessage(sampleDraft);
    setCopied(false);
    setDraftModalOpen(true);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchWhatsApp = () => {
    if (!draftTask?.lead?.phone) return;
    const cleanPhone = draftTask.lead.phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(draftMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
    setDraftModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Follow-Up Task Management"
        description="Zero neglected enquiries. Enforce SLAs, schedule outreach, and dispatch approved WhatsApp follow-ups in Pakistan Standard Time (PKT)."
        badge={
          isDemo ? (
            <span className="badge-dark text-xs uppercase tracking-wider">
              Demo Workspace Mode
            </span>
          ) : (
            <span className="badge-lime text-xs uppercase tracking-wider">
              SLA Enforced
            </span>
          )
        }
      >
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="btn-base btn-primary text-xs font-black shadow-[0_3px_0_0_#101113]"
        >
          <Plus className="w-4 h-4 text-[#B7FF3C]" />
          <span>Schedule Follow-Up</span>
        </button>
      </PageHeader>

      {/* Filter and View Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border-2 border-[#DCDDDA] shadow-[0_2px_0_0_#DCDDDA] text-xs">
        {/* View Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto bg-[#F3F4F2] p-1.5 rounded-2xl border border-[#DCDDDA]">
          {[
            { id: "today", label: "Due Today" },
            { id: "overdue", label: "Overdue", badge: overdueCount > 0 ? overdueCount : undefined },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
            { id: "snoozed", label: "Snoozed" },
          ].map((v) => {
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setCurrentView(v.id as FollowUpView)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#101113] text-[#B7FF3C] shadow-sm"
                    : "text-[#777D77] hover:text-[#101113]"
                }`}
              >
                <span>{v.label}</span>
                {v.badge && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white">
                    {v.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Client Workspace Dropdown */}
        <div className="flex items-center gap-2.5">
          <span className="text-[#101113] font-extrabold">Client Workspace:</span>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <LoadingState type="skeleton" rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={`No ${currentView} follow-up tasks`}
          description={
            currentView === "overdue"
              ? "All enquiries are currently up to date with zero SLA breaches."
              : "No tasks found matching this view. Schedule a follow-up to keep reps accountable."
          }
          action={{
            label: "Schedule Follow-Up Task",
            onClick: () => setCreateModalOpen(true),
            icon: Plus,
          }}
        />
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isTaskOverdue =
              task.status === "pending" && new Date(task.due_at) < new Date();

            return (
              <div
                key={task.id}
                className="rounded-3xl border-2 border-[#DCDDDA] hover:border-[#101113] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_2px_0_0_#DCDDDA] hover:shadow-[0_4px_0_0_#101113] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-black text-[#101113] text-base">
                      {task.lead?.name || "Enquiry Contact"}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#F3F4F2] text-[#101113] border border-[#DCDDDA]">
                      {task.client?.name || "Client Workspace"}
                    </span>
                    {isTaskOverdue ? (
                      <StatusBadge label="SLA Breached" variant="danger" />
                    ) : task.status === "completed" ? (
                      <StatusBadge label="Completed" variant="success" />
                    ) : (
                      <StatusBadge label="Pending Follow-up" variant="warning" />
                    )}
                  </div>

                  <p className="text-xs text-[#777D77] leading-relaxed max-w-xl font-medium">
                    {task.notes || "Follow-up discussion scheduled for this client opportunity."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#777D77] font-bold pt-1">
                    <span className="flex items-center gap-1.5 text-[#101113]">
                      <Clock className="w-4 h-4 text-[#101113]" />
                      <span>
                        Due: {new Date(task.due_at).toLocaleDateString()} at{" "}
                        {new Date(task.due_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} PKT
                      </span>
                    </span>
                    <span>•</span>
                    <span className="capitalize">Channel: {task.task_type}</span>
                    {task.lead?.deal_value ? (
                      <>
                        <span>•</span>
                        <span className="font-black text-[#101113] tabular-nums">
                          Value: {formatCurrencyPKR(task.lead.deal_value)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#DCDDDA]">
                  {task.status !== "completed" && (
                    <>
                      {/* Open WhatsApp with Draft */}
                      {task.lead?.phone && (
                        <button
                          type="button"
                          onClick={() => openWhatsAppDraft(task)}
                          className="btn-base btn-lime text-xs font-black h-9 px-3.5"
                          title="Review AI draft and open WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      {/* Complete Button */}
                      <button
                        type="button"
                        onClick={() => handleCompleteTask(task.id)}
                        className="btn-base btn-primary text-xs font-bold h-9 px-3.5"
                      >
                        <Check className="w-3.5 h-3.5 mr-1 text-[#B7FF3C]" />
                        <span>Complete</span>
                      </button>

                      {/* Reschedule Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleTaskId(task.id);
                          setRescheduleDate(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                        }}
                        className="btn-base btn-secondary text-xs font-bold h-9 px-3 border border-[#DCDDDA]"
                        title="Reschedule task"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      {/* Snooze 1 Day */}
                      <button
                        type="button"
                        onClick={() => handleSnoozeTask(task.id, 1)}
                        className="btn-base btn-secondary text-xs font-bold h-9 px-3 border border-[#DCDDDA]"
                        title="Snooze 1 Day"
                      >
                        <span>+1d</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WHATSAPP DRAFT MODAL */}
      {draftModalOpen && draftTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#101113] text-base">Grounded WhatsApp Draft</h3>
                  <p className="text-xs text-[#777D77] font-medium">To: {draftTask.lead?.name} ({draftTask.lead?.phone})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDraftModalOpen(false)}
                className="p-1.5 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="Review or Edit Message before dispatch">
                <textarea
                  rows={6}
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[#DCDDDA] p-4 text-xs font-medium text-[#202320] focus:border-[#101113] focus:ring-2 focus:ring-[#B7FF3C]/40 outline-none leading-relaxed"
                />
              </FormField>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="btn-base btn-secondary text-xs font-bold px-4"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 mr-1" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1 text-[#101113]" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleLaunchWhatsApp}
                  className="btn-base btn-lime text-xs font-black px-6"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#101113] text-base">Schedule Follow-Up Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>{createError}</p>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <FormField label="Target Client Workspace" required>
                <select
                  value={newTaskClientId}
                  onChange={(e) => setNewTaskClientId(e.target.value)}
                  className="input-base w-full font-bold"
                  required
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Target Lead Contact" required>
                <select
                  value={newTaskLeadId}
                  onChange={(e) => setNewTaskLeadId(e.target.value)}
                  className="input-base w-full font-bold"
                  required
                >
                  {availableLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone || l.email || "No direct phone"})
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Follow-Up Deadline (PKT)" required>
                  <input
                    type="datetime-local"
                    value={newTaskDueAt}
                    onChange={(e) => setNewTaskDueAt(e.target.value)}
                    className="input-base w-full font-bold"
                  />
                </FormField>
                <FormField label="Outreach Channel" required>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                    className="input-base w-full font-bold"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Video Meeting</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Action Notes & Objectives">
                <textarea
                  rows={3}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Review quotation, handle price objection, or confirm sample dispatch..."
                  className="w-full rounded-2xl border-1.5 border-[#DCDDDA] p-3 text-xs text-[#202320] focus:border-[#101113] focus:ring-2 focus:ring-[#B7FF3C]/40 outline-none"
                />
              </FormField>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#DCDDDA]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-base btn-secondary text-xs font-bold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-base btn-primary text-xs font-black px-6 shadow-[0_3px_0_0_#101113]"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <h3 className="font-black text-[#101113] text-base">Reschedule Follow-Up Task</h3>
            <FormField label="New Due Date & Time (PKT)" required>
              <input
                type="datetime-local"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="input-base w-full font-bold"
                required
              />
            </FormField>
            <FormField label="Reason for Rescheduling">
              <input
                type="text"
                value={rescheduleNotes}
                onChange={(e) => setRescheduleNotes(e.target.value)}
                placeholder="e.g. Prospect asked to call back next Tuesday"
                className="input-base w-full"
              />
            </FormField>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleTaskId(null)}
                className="btn-base btn-secondary text-xs font-bold px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="btn-base btn-primary text-xs font-black px-5 shadow-[0_3px_0_0_#101113]"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
