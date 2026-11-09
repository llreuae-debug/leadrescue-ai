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
  X,
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
        setSuccessMessage(`Invitation dispatched to ${inviteEmail}`);
        setShowInviteModal(false);
        setInviteName("");
        setInviteEmail("");
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to send invitation");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send invitation");
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
        setSuccessMessage(`Updated role for ${selectedMember.fullName} to ${newRole}`);
        setShowRoleModal(false);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to modify role");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to modify role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (member: TeamMemberRecord) => {
    const nextStatus: MembershipStatus = member.status === "suspended" ? "active" : "suspended";
    try {
      const res = await updateMemberStatusAction({
        memberId: member.id,
        newStatus: nextStatus,
      });
      if (res.success) {
        setSuccessMessage(`Member status changed to ${nextStatus}`);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to update member status");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update member status");
    }
  };

  const handleResend = async (membershipId: string) => {
    try {
      const res = await resendInvitationAction(membershipId);
      if (res.success) {
        setSuccessMessage("Invitation refreshed and re-sent");
      } else {
        setErrorMessage(res.error || "Failed to re-send invitation");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to re-send invitation");
    }
  };

  const handleRemoveConfirm = async () => {
    if (!memberToRemove) return;
    setIsSubmitting(true);
    try {
      const res = await removeMemberAction(memberToRemove.id);
      if (res.success) {
        setSuccessMessage(`${memberToRemove.fullName} has been removed from agency`);
        setShowRemoveDialog(false);
        setMemberToRemove(null);
        loadTeamData();
      } else {
        setErrorMessage(res.error || "Failed to remove member");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to remove member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManageTeam = currentRole === "owner" || currentRole === "admin";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Agency Team & Roles"
          description="Manage agency collaborators, role-based access control (RBAC), and security audit logs."
          badge={<span className="badge-lime text-[11px] font-bold">RBAC Enforced</span>}
        />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] border-2 border-[#101113] rounded-xl shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role Matrix</span>
          </button>

          {canManageTeam && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="btn-lime text-xs py-2 px-4 inline-flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemo && (
        <div className="card-white p-4 bg-[#F3F4F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#101113] font-medium">
              <strong className="font-bold">Demo Workspace Mode:</strong> Operating as active Owner in local preview. Role protection rules and security audit logs are verified in memory.
            </span>
          </div>
          <span className="badge-dark text-[10px] shrink-0 font-mono">
            OWNER GUARD ENFORCED
          </span>
        </div>
      )}

      {/* Alerts */}
      {successMessage && (
        <div className="card-white p-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="card-white p-4 border-2 border-red-500 bg-red-50 text-red-900 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900 font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Role-Permission Matrix Card */}
      {showMatrix && (
        <div className="card-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#DCDDDA] pb-3">
            <h3 className="text-sm font-black text-[#101113] flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#101113]" />
              Agency Role-Permission Matrix
            </h3>
            <span className="badge-lime text-[10px]">Strict RLS Guard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Capability</th>
                  <th className="pb-3 text-center">Owner</th>
                  <th className="pb-3 text-center">Admin</th>
                  <th className="pb-3 text-center">Manager</th>
                  <th className="pb-3 text-center">Sales Rep</th>
                  <th className="pb-3 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDDA] text-[#101113] font-medium">
                <tr>
                  <td className="py-2.5 font-bold">Agency Workspace & Billing Deletion</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Invite Team Members & Assign Roles</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Create & Archive Client Workspaces</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Create, Update & Reassign Leads</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">AI Grounded Follow-up Drafting</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">View Reports & Lead Analytics</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                  <td className="py-2.5 text-center text-[#777D77]">✗</td>
                  <td className="py-2.5 text-center font-black text-emerald-700">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Members Directory Table */}
      <div className="card-white overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b-2 border-[#DCDDDA] flex items-center justify-between bg-[#F3F4F2]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#101113]" />
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">Agency Members</h3>
            <span className="badge-dark text-[10px] font-mono">
              {members.length}
            </span>
          </div>
          <span className="text-xs text-[#777D77] font-medium">
            Your role: <strong className="text-[#101113] uppercase font-bold">{currentRole}</strong>
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
                <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px] bg-white">
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined / Invited</th>
                  {canManageTeam && <th className="py-3 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDDA]">
                {members.map((member) => {
                  return (
                    <tr key={member.id} className="hover:bg-[#F3F4F2] transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#17191C] text-[#B7FF3C] flex items-center justify-center font-black text-xs border border-[#101113]">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-[#101113] block">{member.fullName}</span>
                            <span className="text-[#777D77] text-[11px] flex items-center gap-1 font-medium">
                              <Mail className="w-3 h-3 text-[#777D77]" />
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 ${
                            member.role === "owner"
                              ? "bg-[#17191C] text-[#B7FF3C] border-[#101113]"
                              : member.role === "admin"
                              ? "bg-[#B7FF3C] text-[#101113] border-[#101113]"
                              : "bg-[#F3F4F2] text-[#101113] border-[#101113]"
                          }`}
                        >
                          {member.role.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
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

                      <td className="py-3.5 px-4 text-[#777D77] font-mono text-[11px] font-bold">
                        {new Date(member.joinedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {canManageTeam && (
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {member.status === "invited" && (
                              <button
                                type="button"
                                onClick={() => handleResend(member.id)}
                                className="px-2.5 py-1 text-[11px] font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] rounded-lg border-2 border-[#101113] transition-colors"
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
                              className="px-2.5 py-1 text-[11px] font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] rounded-lg border-2 border-[#101113] transition-colors"
                            >
                              Role
                            </button>

                            {/* Suspend / Activate Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(member)}
                              className={`p-1.5 rounded-lg border-2 transition-colors ${
                                member.status === "suspended"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-500"
                                  : "bg-amber-50 text-amber-800 border-amber-500"
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
                              className="p-1.5 rounded-lg border-2 border-red-500 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
      <div className="card-charcoal p-6 rounded-3xl border-2 border-[#101113] text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#B7FF3C]" />
              Team Security Audit Trail
            </h3>
            <p className="text-xs text-slate-400 font-medium">Immutable record of invitations, role modifications, and suspensions.</p>
          </div>
          <span className="badge-lime text-[10px]">Security Event Log</span>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center font-medium">No security audit logs recorded yet.</p>
        ) : (
          <div className="space-y-3 pt-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#282B30] border border-[#3A3F47] text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.actorName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-black text-[#B7FF3C] uppercase text-[10px] tracking-wider">{log.action.replace(/_/g, " ")}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-mono text-[11px]">{log.targetEmail}</span>
                  </div>
                  {log.details && <p className="text-slate-400 text-[11px] font-medium">{log.details}</p>}
                </div>

                <span className="text-slate-400 text-[11px] shrink-0 font-mono font-bold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] flex items-center gap-2 uppercase tracking-wider">
                <UserPlus className="w-4 h-4 text-[#101113]" />
                Invite Team Member
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Asad Rehman"
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                />
              </FormField>

              <FormField label="Work Email Address" required>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="asad@agency.pk"
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                />
              </FormField>

              <FormField label="Assign Role" required>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AgencyRole)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                >
                  {currentRole === "owner" && <option value="owner">Owner (Full Agency Control & Billing)</option>}
                  <option value="admin">Admin (Manage Team, Clients & Integrations)</option>
                  <option value="manager">Manager (Manage Clients, Leads & Assignments)</option>
                  <option value="sales_representative">Sales Representative (Manage Assigned Leads & AI Drafts)</option>
                  <option value="viewer">Viewer (Read-Only Access)</option>
                </select>
              </FormField>

              <div className="bg-[#F3F4F2] rounded-2xl p-3.5 text-[11px] text-[#101113] border-2 border-[#101113] space-y-1 font-medium">
                <strong className="font-bold">Invitation Flow:</strong> The recipient will receive an activation email with a secure registration link. Role capabilities take effect immediately upon first sign-in.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary text-xs px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lime text-xs px-5 py-2.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">Modify Member Role</h3>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#777D77] font-medium">
                Update permissions for <strong className="text-[#101113] font-bold">{selectedMember.fullName}</strong> ({selectedMember.email}):
              </p>

              <FormField label="Select New Role">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AgencyRole)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                >
                  {currentRole === "owner" && <option value="owner">Owner (Full Control)</option>}
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="sales_representative">Sales Representative</option>
                  <option value="viewer">Viewer</option>
                </select>
              </FormField>

              {selectedMember.role === "owner" && newRole !== "owner" && (
                <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-3.5 text-[11px] text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium">
                    <strong className="font-bold">Owner Demotion Check:</strong> Demoting an Owner will only succeed if at least one other active Owner remains in the agency.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="btn-secondary text-xs px-4 py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || newRole === selectedMember.role}
                onClick={handleRoleChangeSubmit}
                className="btn-primary text-xs px-5 py-2.5 disabled:opacity-50"
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
