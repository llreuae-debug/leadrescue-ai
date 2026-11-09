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
  Phone,
  Mail,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  RotateCw,
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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Follow-Up Task Management"
        description="Zero neglected enquiries. Enforce SLAs, schedule outreach, and dispatch approved WhatsApp follow-ups in Pakistan Standard Time (PKT)."
        badge={
          isDemo ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace Mode
            </span>
          ) : (
            <StatusBadge label="SLA Enforced" variant="success" />
          )
        }
      >
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs h-9 px-3.5"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Schedule Follow-Up</span>
        </button>
      </PageHeader>

      {/* Filter and View Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
        {/* View Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{v.label}</span>
                {v.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {v.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Client Workspace Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Workspace:</span>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-8 py-0 bg-slate-50 font-semibold"
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
        <div className="space-y-3">
          {tasks.map((task) => {
            const isTaskOverdue =
              task.status === "pending" && new Date(task.due_at) < new Date();

            return (
              <div
                key={task.id}
                className="linear-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {task.lead?.name || "Enquiry Contact"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
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

                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    {task.notes || "Follow-up discussion scheduled for this client opportunity."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
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
                        <span className="font-semibold text-slate-800 tabular-nums">
                          Value: {formatCurrencyPKR(task.lead.deal_value)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {task.status !== "completed" && (
                    <>
                      {/* Open WhatsApp with Draft */}
                      {task.lead?.phone && (
                        <button
                          type="button"
                          onClick={() => openWhatsAppDraft(task)}
                          className="btn-base bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold h-8 px-2.5"
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
                        className="btn-base bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold h-8 px-2.5"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        <span>Complete</span>
                      </button>

                      {/* Reschedule Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleTaskId(task.id);
                          setRescheduleDate(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                        }}
                        className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 px-2"
                        title="Reschedule task"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>

                      {/* Snooze 1 Day */}
                      <button
                        type="button"
                        onClick={() => handleSnoozeTask(task.id, 1)}
                        className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 px-2"
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

      {/* RESCHEDULE MODAL */}
      {rescheduleTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-md linear-card p-6 bg-white shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Reschedule Follow-Up Task</h3>
              <button
                type="button"
                onClick={() => setRescheduleTaskId(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <FormField label="New Due Date & Time (PKT)" required>
              <input
                type="datetime-local"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="input-base w-full"
              />
            </FormField>

            <FormField label="Reschedule Reason / Updated Instructions">
              <textarea
                rows={3}
                value={rescheduleNotes}
                onChange={(e) => setRescheduleNotes(e.target.value)}
                placeholder="e.g. Prospect asked to call after Friday prayers..."
                className="input-base w-full h-auto py-2 text-xs"
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleTaskId(null)}
                className="btn-base bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 h-9"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FOLLOW-UP MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-lg linear-card p-6 bg-white shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Schedule Follow-Up Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <FormField label="Select Target Lead" required>
                <select
                  value={newTaskLeadId}
                  onChange={(e) => setNewTaskLeadId(e.target.value)}
                  className="input-base w-full"
                >
                  {availableLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.client?.name || "Client"}) — {l.phone || l.email}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Client Workspace" required>
                  <select
                    value={newTaskClientId}
                    onChange={(e) => setNewTaskClientId(e.target.value)}
                    className="input-base w-full"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Communication Channel" required>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                    className="input-base w-full"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="call">Phone Call</option>
                    <option value="email">Email Outreach</option>
                    <option value="meeting">Video / In-Person Meeting</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Due Date & Time (PKT)" required>
                <input
                  type="datetime-local"
                  required
                  value={newTaskDueAt}
                  onChange={(e) => setNewTaskDueAt(e.target.value)}
                  className="input-base w-full"
                />
              </FormField>

              <FormField label="Follow-up Instructions / Notes">
                <textarea
                  rows={3}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Specific follow-up goals, questions, or discount terms to mention..."
                  className="input-base w-full h-auto py-2 text-xs"
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-base bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 h-9"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 h-9 shadow-xs"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WHATSAPP DRAFT REVIEW & LAUNCH MODAL */}
      {draftModalOpen && draftTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-lg linear-card p-6 bg-white shadow-xl space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Review Approved WhatsApp Draft
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDraftModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-semibold text-slate-900">
                To: {draftTask.lead?.name} ({draftTask.lead?.phone})
              </p>
              <p className="text-slate-500 text-[11px]">Client Account: {draftTask.client?.name}</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Draft Message (Grounded AI Follow-up)
              </label>
              <textarea
                rows={6}
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                className="input-base w-full h-auto py-2.5 text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopyDraft}
                className="btn-base bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold h-9 px-3"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDraftModalOpen(false)}
                  className="btn-base bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 h-9"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLaunchWhatsApp}
                  className="btn-base bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
                >
                  <span>Open in WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
