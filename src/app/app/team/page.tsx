"use client";

import { useState, useEffect, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/ui/FormField";
import { AgencyRole, MembershipStatus } from "@/types/database";
import { TeamAuditLogEntry, TeamMemberRecord } from "@/lib/team/team-management";
import {
  getTeamDataAction,
  inviteTeamMemberAction,
  removeMemberAction,
  resendInvitationAction,
  updateMemberRoleAction,
  updateMemberStatusAction,
} from "@/app/actions/team";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  Mail,
  RotateCcw,
  UserX,
  UserCheck,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  Lock,
  ChevronDown,
} from "lucide-react";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<TeamAuditLogEntry[]>([]);
  const [currentRole, setCurrentRole] = useState<AgencyRole>("viewer");
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<AgencyRole>("sales_representative");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Role update state
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberRecord | null>(null);
  const [newRole, setNewRole] = useState<AgencyRole>("sales_representative");

  // Remove confirmation
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMemberRecord | null>(null);

  // Matrix accordion
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const loadTeamData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getTeamDataAction();
      if (res.success) {
        setMembers(res.members);
        setAuditLogs(res.auditLogs);
        setCurrentRole(res.currentMemberRole);
        setIsDemo(Boolean(res.isDemo));
      } else {
        setErrorMessage(res.error || "Failed to load agency members");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load team data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await inviteTeamMemberAction({
        fullName: inviteName,
        email: inviteEmail,
        role: inviteRole,
      });

      if (res.success) {
        setShowInviteModal(false);
        setInviteName("");
        setInviteEmail("");
        setSuccessMessage(`Invitation dispatched to ${inviteEmail}`);
        setTimeout(() => setSuccessMessage(null), 4000);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to send invitation");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invitation error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChangeSubmit = async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await updateMemberRoleAction({
        memberId: selectedMember.id,
        newRole,
      });

      if (res.success) {
        setShowRoleModal(false);
        setSelectedMember(null);
        setSuccessMessage(`Role successfully updated to ${newRole.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 4000);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to update role");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Role change error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (memberId: string) => {
    setErrorMessage(null);
    try {
      const res = await resendInvitationAction(memberId);
      if (res.success) {
        setSuccessMessage("Invitation notification resent.");
        setTimeout(() => setSuccessMessage(null), 3000);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to resend invitation");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Resend error");
    }
  };

  const handleStatusToggle = async (member: TeamMemberRecord) => {
    const nextStatus: MembershipStatus = member.status === "active" ? "suspended" : "active";
    setErrorMessage(null);
    try {
      const res = await updateMemberStatusAction({
        memberId: member.id,
        newStatus: nextStatus,
      });
      if (res.success) {
        setSuccessMessage(`Member status updated to ${nextStatus.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to change status");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Status change error");
    }
  };

  const handleRemoveConfirm = async () => {
    if (!memberToRemove) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await removeMemberAction(memberToRemove.id);
      if (res.success) {
        setShowRemoveDialog(false);
        setMemberToRemove(null);
        setSuccessMessage("Member removed from agency.");
        setTimeout(() => setSuccessMessage(null), 3000);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to remove member");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Removal error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManageTeam = currentRole === "owner" || currentRole === "admin";

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Team Management"
          description="Manage agency team members, permissions, and audit logs with strict role boundaries."
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Role Permissions Matrix</span>
          </button>

          {canManageTeam && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Workspace Mode:</strong> Operating as active Owner in local preview. Role protection rules and security audit logs are verified in memory.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-900 text-[11px] px-2 py-0.5 rounded font-mono">
            OWNER GUARD ENFORCED
          </span>
        </div>
      )}

      {/* Alerts */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-semibold text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Role-Permission Matrix Card */}
      {showMatrix && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Agency Role-Permission Matrix
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Strict RLS & Server Guard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-2">Capability</th>
                  <th className="pb-2 text-center">Owner</th>
                  <th className="pb-2 text-center">Admin</th>
                  <th className="pb-2 text-center">Manager</th>
                  <th className="pb-2 text-center">Sales Rep</th>
                  <th className="pb-2 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2 font-medium">Agency Workspace & Billing Deletion</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Invite Team Members & Assign Roles</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Create & Archive Client Workspaces</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Create, Update & Reassign Leads</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">AI Grounded Follow-up Drafting</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">View Reports & Lead Analytics</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-2 text-center text-slate-300">✗</td>
                  <td className="py-2 text-center font-bold text-emerald-600">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Members Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Agency Members</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              {members.length}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Your role: <strong className="text-blue-700 uppercase font-semibold">{currentRole}</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="p-8">
            <LoadingState message="Loading agency membership directory..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined / Invited</th>
                  {canManageTeam && <th className="py-3 px-5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => {
                  const isOwner = member.role === "owner";
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs border border-slate-200">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{member.fullName}</span>
                            <span className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${
                            member.role === "owner"
                              ? "bg-violet-100 text-violet-800 border border-violet-200"
                              : member.role === "admin"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : member.role === "manager"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {member.role.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge
                          label={member.status.toUpperCase()}
                          variant={
                            member.status === "active"
                              ? "success"
                              : member.status === "invited"
                              ? "warning"
                              : "danger"
                          }
                          dot
                        />
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(member.joinedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {canManageTeam && (
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {member.status === "invited" && (
                              <button
                                type="button"
                                onClick={() => handleResend(member.id)}
                                className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                              >
                                Resend
                              </button>
                            )}

                            {/* Change Role Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMember(member);
                                setNewRole(member.role);
                                setShowRoleModal(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 shadow-2xs transition-colors"
                            >
                              Role
                            </button>

                            {/* Suspend / Activate Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(member)}
                              className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                                member.status === "suspended" ? "text-emerald-600" : "text-amber-600"
                              }`}
                              title={member.status === "suspended" ? "Reactivate member" : "Suspend member access"}
                            >
                              {member.status === "suspended" ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Remove Member */}
                            <button
                              type="button"
                              onClick={() => {
                                setMemberToRemove(member);
                                setShowRemoveDialog(true);
                              }}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Remove member"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Audit Log Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Team Security Audit Trail
            </h3>
            <p className="text-xs text-slate-500">Immutable record of invitations, role modifications, and suspensions.</p>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No security audit logs recorded yet.</p>
        ) : (
          <div className="space-y-2.5 pt-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{log.actorName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-blue-700 uppercase text-[11px]">{log.action.replace(/_/g, " ")}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-mono text-[11px]">{log.targetEmail}</span>
                  </div>
                  {log.details && <p className="text-slate-500 text-[11px]">{log.details}</p>}
                </div>

                <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Invite Team Member
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Asad Rehman"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </FormField>

              <FormField label="Work Email Address" required>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="asad@agency.pk"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </FormField>

              <FormField label="Assign Role" required>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AgencyRole)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
                >
                  {currentRole === "owner" && <option value="owner">Owner (Full Agency Control & Billing)</option>}
                  <option value="admin">Admin (Manage Team, Clients & Integrations)</option>
                  <option value="manager">Manager (Manage Clients, Leads & Assignments)</option>
                  <option value="sales_representative">Sales Representative (Manage Assigned Leads & AI Drafts)</option>
                  <option value="viewer">Viewer (Read-Only Access)</option>
                </select>
              </FormField>

              <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 border border-slate-100 space-y-1">
                <strong>Invitation Flow:</strong> The recipient will receive an activation email with a secure registration link. Role capabilities take effect immediately upon first sign-in.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg shadow-2xs transition-colors"
                >
                  {isSubmitting ? "Dispatching..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Modify Member Role</h3>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Update permissions for <strong className="text-slate-900">{selectedMember.fullName}</strong> ({selectedMember.email}):
              </p>

              <FormField label="Select New Role">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AgencyRole)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
                >
                  {currentRole === "owner" && <option value="owner">Owner (Full Control)</option>}
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="sales_representative">Sales Representative</option>
                  <option value="viewer">Viewer</option>
                </select>
              </FormField>

              {selectedMember.role === "owner" && newRole !== "owner" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Owner Demotion Check:</strong> Demoting an Owner will only succeed if at least one other active Owner remains in the agency.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || newRole === selectedMember.role}
                onClick={handleRoleChangeSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg shadow-2xs transition-colors"
              >
                {isSubmitting ? "Updating..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Dialog */}
      {showRemoveDialog && memberToRemove && (
        <ConfirmDialog
          open={showRemoveDialog}
          onOpenChange={(val) => {
            if (!val) {
              setShowRemoveDialog(false);
              setMemberToRemove(null);
            }
          }}
          title="Remove Agency Member"
          description={`Are you sure you want to remove ${memberToRemove.fullName} (${memberToRemove.email}) from the agency workspace? Their access will be immediately terminated.`}
          confirmLabel="Remove Member"
          cancelLabel="Cancel"
          isDestructive={true}
          isLoading={isSubmitting}
          onConfirm={handleRemoveConfirm}
        />
      )}
    </div>
  );
}
